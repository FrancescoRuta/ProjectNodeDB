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

export type JoinableSelectWithFileds<F> = Joinable & F;

export type ObjKeyMap<T> = T extends infer U ? { [K in keyof U]: U[K] } : never
export type ConcatTypesToQueryColumn<N extends string, T, R> = ObjKeyMap<{[J in N]: QueryColumn<N, T>} & R>;
export type ColTypeRecursionToQueryColumn<A extends readonly [...any]> = A extends [infer L, ...infer R] ? (
		L extends QueryColumn<infer N, infer T> ? ConcatTypesToQueryColumn<N, T, ColTypeRecursionToQueryColumn<R>> : ColTypeRecursionToQueryColumn<R>
	) : unknown;
export type ConcatTypesTo<N extends string, T, R> = ObjKeyMap<{[J in N]: T} & R>;
export type ColTypeRecursion<A extends readonly [...any]> = A extends [infer L, ...infer R] ? (
		L extends QueryColumn<infer N, infer T> ? ConcatTypesTo<N, T, ColTypeRecursion<R>> : ColTypeRecursion<R>
	) : unknown;
	
export interface SelectParams<D, F extends QueryColumn<string, any>[]> {
	from: Joinable;
	fields?: [...F];
	where?: string;
	groupBy?: QueryColumn<string, any> | string | (QueryColumn<string, any> | string)[];
	having?: string;
	orderBy?: QueryColumn<string, any> | string | (QueryColumn<string, any> | string)[];
	limitOffset?: number;
	limitSize?: number;
	additionalBindableEntities?: any;
	dbEngineArgs?: D;
}

class JoinableSelect<D, F extends QueryColumn<string, any>[]> extends Joinable {
	private foreignKeys: ForeignKey[];
	private primaryKeys: JoinablePrimaryKey[];
	public constructor(private sql: string, alias: string, selectParams: SelectParams<D, F>, private entityBindings: any, private escapeFunction: (ident: string) => string) {
		super();
		let fields = selectParams.fields ? Array.isArray(selectParams.fields) ? selectParams.fields : [selectParams.fields] : undefined;
		let { __foreignKeys, __primaryKeys }: { __foreignKeys: ForeignKey[], __primaryKeys: JoinablePrimaryKey[] } = <any>selectParams.from;
		[__foreignKeys, __primaryKeys] = this.filterKeys(fields, alias, __foreignKeys, __primaryKeys);
		this.foreignKeys = __foreignKeys;
		this.primaryKeys = __primaryKeys;
	}
	private filterKeys(fields: QueryColumn<string, any>[] | undefined, alias: string, __foreignKeys: ForeignKey[], __primaryKeys: JoinablePrimaryKey[]): [ForeignKey[], JoinablePrimaryKey[]] {
		if (fields) {
			let fks = [];
			let pks = [];
			for (let field of fields) {
				let fk = __foreignKeys.find(fk => field.columnFullIdentifier == fk.column.columnFullIdentifier);
				let pk = __primaryKeys.find(pk => field.columnFullIdentifier == pk.column.columnFullIdentifier);
				if (fk) {
					//field is a foreign key
					let data = field.getData();
					data.unescapedDbName = undefined;
					data.unescapedTableName = alias;
					data.unescapedColumnName = data.userColumnAlias;
					data.userColumnAlias;
					fks.push({
						column: new QueryColumn(data, this.escapeFunction),
						tableName: fk.tableName,
						ambiguous: fk.ambiguous,
					});
				}
				if (pk) {
					//field is a primary key
					let data = field.getData();
					data.unescapedDbName = undefined;
					data.unescapedTableName = alias;
					data.unescapedColumnName = data.userColumnAlias;
					data.userColumnAlias;
					pks.push({
						column: new QueryColumn(data, this.escapeFunction),
						tableName: pk.tableName,
						ambiguous: pk.ambiguous,
					});
				}
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

export class Select<D, F extends QueryColumn<string, any>[]> extends BindableEnity {
	private __sql: string;
	private static aliasUid = 0;
	public constructor(private selectParams: SelectParams<D, F>, private escapeFunction: (ident: string) => string) {
		super();
		this.__sql = this.computeSql();
	}
	private computeSql(): string {
		let fieldsArr = this.selectParams.fields ? (Array.isArray(this.selectParams.fields) ? this.selectParams.fields : [this.selectParams.fields]) : undefined;
		let fields: string = fieldsArr? fieldsArr.map(a => a.aliasedColumnFullIdentifier).join(",") : "*";
		let { from, limitOffset, limitSize, where, groupBy, having, orderBy } = this.selectParams;

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

		
		return replaceColumnPlaceholders(sql, {...(<any>from).__entityBindings, ...this.selectParams.additionalBindableEntities})
			.replace(/\s+/gm, " ")
			.replace(/\s*\(\s*/gm, "(")
			.replace(/\s*\)\s*/gm, ")")
			.trim();
	}

	private clauseToString(clause: "GROUP BY" | "ORDER BY" | "WHERE" | "HAVING", content: undefined | QueryColumn<string, any> | string | (QueryColumn<string, any> | string)[]): string {
		if (!content) return "";
		let result: string;
		if (Array.isArray(content)) {
			result = content.map(a => a instanceof QueryColumn ? a.columnFullIdentifier : a).join(",");
		} else if (content instanceof QueryColumn) {
			result = content.columnFullIdentifier;
		} else {
			result = content;
		}

		return ` ${clause} ${result}`;
	}
	public asJoinable(alias?: string) {
		if (!alias) alias = "JoinableSelect" + Select.aliasUid++;
		let entityBinding: any = {};
		let res = this.createJoinableProxy(
			alias,
			new JoinableSelect(
				"(" + this.__sql + ") AS " + alias,
				alias,
				this.selectParams,
				entityBinding,
				this.escapeFunction
			)
		);
		entityBinding[alias] = res;
		return res as JoinableSelectWithFileds<ColTypeRecursionToQueryColumn<F>>;
	}
	private createJoinableProxy(alias: string, joinableSelect: JoinableSelect<D, F>): any {
		let fields: {[alias: string]: QueryColumn<string, any>} = {};
		(this.selectParams.fields ?? []).forEach(f => fields[f.userColumnAlias] = f);
		return new Proxy(joinableSelect, {
			get: (target: any, key) => {
				let k = key.toString();
				if (fields[k]) {
					return fields[k];
				} else {
					return target[key];
				}
			},
		});
	}
	public get hasHardLimit(): boolean {
		return this.selectParams.limitSize != null;
	}
	public prepare<T>(dbInterfaceConfig: DbInterfaceConfig<T, D>, executeBefore: ExecuteBefore<void>): PreparedSelect<D, ColTypeRecursion<F>> {
		let [sql, paramNames] = getPositionalQuery(this.__sql);
		return new PreparedSelect(dbInterfaceConfig.dbEngine, sql, paramNames, executeBefore, this.selectParams.dbEngineArgs);
	}
	public preparePaged<T>(dbInterfaceConfig: DbInterfaceConfig<T, D>, executeBefore: ExecuteBefore<number | undefined>): PreparedSelectPaged<D, ColTypeRecursion<F>> {
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

export class PreparedSelect<D, F> extends PreparedQuery {
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

	public run(params?: any): Promise<F[]> {
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

export class PreparedSelectPaged<D, F> extends PreparedQuery {
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

	public run(params?: any): Promise<F[]> {
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
