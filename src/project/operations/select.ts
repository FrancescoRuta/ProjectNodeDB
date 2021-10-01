import { IDbEngine } from "../db_engine";
import { DbInterfaceConfig, ExecuteBefore } from "../db_interface";
import {
	BindableEnity,
	ForeignKey,
	Joinable,
	JoinablePrimaryKey,
	QueryColumn,
} from "../entities";
import { PreparedQuery } from "../prepared_query";
import { getPositionalQuery, replaceColumnPlaceholders, tokenizeSqlString } from "../sql_helper";

export type JoinableSelectWithFileds = Joinable & {
	[col: string]: QueryColumn;
};

export interface SelectParams<D> {
	from: Joinable;
	fields?: QueryColumn | string | (QueryColumn | string)[];
	where?: string;
	groupBy?: QueryColumn | string | (QueryColumn | string)[];
	having?: string;
	orderBy?: QueryColumn | string | (QueryColumn | string)[];
	limitOffset?: number;
	limitSize?: number;
	additionalBindableEntities?: any;
	dbEngineArgs?: D;
}

class JoinableSelect<D> extends Joinable {
	private foreignKeys: ForeignKey[];
	private primaryKeys: JoinablePrimaryKey[];
	public constructor(
		private sql: string,
		alias: string,
		selectParams: SelectParams<D>,
		private entityBindings: any,
	) {
		super();
		let fields = selectParams.fields
			? Array.isArray(selectParams.fields)
				? selectParams.fields
				: [selectParams.fields]
			: undefined;
		let {
			__foreignKeys,
			__primaryKeys,
		}: {
			__foreignKeys: ForeignKey[];
			__primaryKeys: JoinablePrimaryKey[];
		} = <any>selectParams.from;
		[__foreignKeys, __primaryKeys] = this.filterKeys(
			<QueryColumn[] | undefined>(
				fields?.filter((f) => f instanceof QueryColumn)
			),
			alias,
			__foreignKeys,
			__primaryKeys
		);
		this.foreignKeys = __foreignKeys;
		this.primaryKeys = __primaryKeys;
	}
	private filterKeys(
		fields: QueryColumn[] | undefined,
		alias: string,
		__foreignKeys: ForeignKey[],
		__primaryKeys: JoinablePrimaryKey[]
	): [ForeignKey[], JoinablePrimaryKey[]] {
		if (fields) {
			let fks = [];
			let pks = [];
			for (let field of fields) {
				let fk = __foreignKeys.find(
					(fk) => field.columnFullName == fk.column.columnFullName
				);
				let pk = __primaryKeys.find(
					(pk) => field.columnFullName == pk.column.columnFullName
				);
				if (fk)
					fks.push({
						column: new QueryColumn(
							null,
							alias,
							field.alias ? field.alias : field.columnName,
							field.alias ? field.alias : field.columnName
						),
						tableName: fk.tableName,
						ambiguous: fk.ambiguous,
					});
				if (pk)
					pks.push({
						column: new QueryColumn(
							null,
							alias,
							field.alias ? field.alias : field.columnName,
							field.alias ? field.alias : field.columnName
						),
						tableName: pk.tableName,
						ambiguous: pk.ambiguous,
					});
			}
			__foreignKeys = fks;
			__primaryKeys = pks;
		}
		return [__foreignKeys, __primaryKeys];
	}
	protected get __entityBindings(): any {
		return this.entityBindings;
	}
	protected get __foreignKeys(): ForeignKey[] {
		return this.foreignKeys;
	}
	protected get __primaryKeys(): JoinablePrimaryKey[] {
		return this.primaryKeys;
	}
	protected get __sqlFrom(): string {
		return this.sql;
	}
}

export class Select<D> extends BindableEnity {
	private __sql: string;
	private static aliasUid = 0;
	public constructor(private selectParams: SelectParams<D>) {
		super();
		this.__sql = this.computeSql(selectParams);
	}
	private computeSql(selectParams: SelectParams<D>): string {
		let fieldsArr = selectParams.fields ? (Array.isArray(selectParams.fields) ? selectParams.fields : [selectParams.fields]) : undefined;
		let fields: string = fieldsArr? fieldsArr.map((a) => a instanceof QueryColumn ? a.aliasedColumn : a).join(",") : "*";
		let { from, limitOffset, limitSize, where, groupBy, having, orderBy } = selectParams;

		let limit = limitSize ? ` LIMIT ${limitOffset ? limitOffset + "," : ""}${limitSize}` : "";

		let sql =
			"SELECT " +
			fields +
			" FROM " +
			(<any>from).__sqlFrom +
			this.clauseToString("WHERE", where) +
			this.clauseToString("GROUP BY", groupBy) +
			this.clauseToString("HAVING", having) +
			this.clauseToString("ORDER BY", orderBy) +
			limit;

		
		return replaceColumnPlaceholders(sql, {...(<any>from).__entityBindings, ...selectParams.additionalBindableEntities})
			.replace(/\s+/gm, " ")
			.replace(/\s*\(\s*/gm, "(")
			.replace(/\s*\)\s*/gm, ")")
			.trim();
	}

	private clauseToString(
		clause: "GROUP BY" | "ORDER BY" | "WHERE" | "HAVING",
		content: undefined | QueryColumn | string | (QueryColumn | string)[]
	): string {
		if (!content) return "";
		let result: string;
		if (Array.isArray(content)) {
			result = content
				.map((a) => (a instanceof QueryColumn ? a.columnFullName : a))
				.join(",");
		} else if (content instanceof QueryColumn) {
			result = content.columnFullName;
		} else {
			result = content;
		}

		return ` ${clause} ${result}`;
	}
	public asJoinable(alias?: string): JoinableSelectWithFileds {
		if (!alias) alias = "JoinableSelect" + Select.aliasUid++;
		let entityBinding: any = {};
		let res = this.createJoinableProxy(
			alias,
			new JoinableSelect(
				"(" + this.__sql + ") AS " + alias,
				alias,
				this.selectParams,
				entityBinding
			)
		);
		entityBinding[alias] = res;
		return res;
	}
	private createJoinableProxy(
		alias: string,
		joinableSelect: JoinableSelect<D>
	): any {
		return new Proxy(joinableSelect, {
			get: (target: any, key) => {
				let k = key.toString();
				if (
					k.startsWith("__") ||
					k == "innerJoin" ||
					k == "leftJoin" ||
					k == "rightJoin" ||
					k == "naturalJoin"
				) {
					return target[key];
				} else {
					return new QueryColumn(null, alias, k, k);
				}
			},
		});
	}
	public get hasHardLimit(): boolean {
		return this.selectParams.limitSize != null;
	}
	public prepare<T>(dbInterfaceConfig: DbInterfaceConfig<T, D>, executeBefore: ExecuteBefore<void>): PreparedSelect<D> {
		let [sql, paramNames] = getPositionalQuery(this.__sql);
		return new PreparedSelect(dbInterfaceConfig.dbEngine, sql, paramNames, executeBefore, this.selectParams.dbEngineArgs);
	}
	public preparePaged<T>(dbInterfaceConfig: DbInterfaceConfig<T, D>, executeBefore: ExecuteBefore<number | undefined>): PreparedSelectPaged<D> {
		if (this.hasHardLimit)
			throw new Error(
				"Pagination is not allowed for selects with hard limit."
			);
		let [sql, paramNames] = getPositionalQuery(this.__sql);
		return new PreparedSelectPaged(
			dbInterfaceConfig.dbEngine,
			dbInterfaceConfig.pageIndexParam,
			dbInterfaceConfig.getLimitByPageIndex,
			sql,
			paramNames,
			executeBefore,
			this.selectParams.dbEngineArgs
		);
	}
	protected get __enityBinding(): string {
		return `(${this.__sql})`;
	}
}

export class PreparedSelect<D> extends PreparedQuery {
	private paramIndexes: number[];
	public constructor(
		private dbEngine: IDbEngine<D>,
		private sql: string,
		private paramNames: string[],
		private executeBefore: ExecuteBefore<void>,
		private dbEngineArgs: D | undefined,
	) {
		super();
		this.paramIndexes = paramNames.map((_, i) => i);
	}

	public run(params?: any): Promise<any[]> {
		if (Array.isArray(params)) {
			this.executeBefore({params, paramNames: this.paramIndexes, queryType: "SELECT"});
			return this.dbEngine.executeSelect(this.sql, params, this.dbEngineArgs);
		} else {
			this.executeBefore({params, paramNames: this.paramNames, queryType: "SELECT"});
			return this.dbEngine.executeSelect(
				this.sql,
				this.paramNames.map((p) => params[p]),
				this.dbEngineArgs
			);
		}
	}
}

export class PreparedSelectPaged<D> extends PreparedQuery {
	private paramIndexes: number[];
	public constructor(
		private dbEngine: IDbEngine<D>,
		private pageIndexParam: string,
		private getLimitByPageIndex: (pageIndex: number) => [number, number],
		private sql: string,
		private paramNames: string[],
		private executeBefore: ExecuteBefore<number | undefined>,
		private dbEngineArgs: D | undefined,
	) {
		super();
		this.paramIndexes = paramNames.map((_, i) => i);
		this.sql += " LIMIT ?,?";
	}

	public run(params?: any): Promise<any[]> {
		if (Array.isArray(params)) {
			let pageIndex = params[params.length - 1];
			let executeBeforeResult = this.executeBefore({params, paramNames: this.paramIndexes, queryType: "SELECT_PAGED"});
			pageIndex = pageIndex ?? executeBeforeResult;
			pageIndex ??= 0;
			if (pageIndex < 0) pageIndex = 0;
			return this.dbEngine.executeSelect(
				this.sql,
				params.concat(this.getLimitByPageIndex(pageIndex)),
				this.dbEngineArgs
			);
		} else {
			let pageIndex = params[this.pageIndexParam];
			let executeBeforeResult = this.executeBefore({params, paramNames: this.paramNames, queryType: "SELECT_PAGED"});
			pageIndex = pageIndex ?? executeBeforeResult;
			pageIndex ??= 0;
			if (pageIndex < 0) pageIndex = 0;
			return this.dbEngine.executeSelect(
				this.sql,
				this.paramNames
					.map((p) => params[p])
					.concat(this.getLimitByPageIndex(pageIndex)),
					this.dbEngineArgs
			);
		}
	}
}
