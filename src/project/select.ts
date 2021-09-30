import { IDbEngine } from "./db_engine";
import { DbInterfaceConfig } from "./db_interface";
import {
	ForeignKey,
	Joinable,
	JoinablePrimaryKey,
	QueryColumn,
	SqlFrom,
} from "./entities";
import { PreparedQuery } from "./prepared_query";
import { getPositionalQuery, tokenizeSqlString } from "./sql_helper";

export type JoinableSelectWithFileds = Joinable & {
	[col: string]: QueryColumn;
};

export interface SelectParams {
	from: Joinable;
	fields?: QueryColumn | string | (QueryColumn | string)[];
	where?: string;
	groupBy?: QueryColumn | string | (QueryColumn | string)[];
	having?: string;
	orderBy?: QueryColumn | string | (QueryColumn | string)[];
	limitOffset?: number;
	limitSize?: number;
	entityParams: any;
}

class JoinableSelect extends Joinable {
	private foreignKeys: ForeignKey[];
	private primaryKeys: JoinablePrimaryKey[];
	public constructor(
		private sql: string,
		alias: string,
		selectParams: SelectParams
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

export class Select {
	private __sql: string;
	private static aliasUid = 0;
	public constructor(private selectParams: SelectParams) {
		this.__sql = this.computeSql(selectParams);
	}
	private computeSql(selectParams: SelectParams): string {
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

		let tokens = tokenizeSqlString(sql);
		sql = "";
		for(let token of tokens){
			if(token.ty == "COLUMN_PLACEHOLDER"){
				let objectPathStr = token.value.substring(1);
				let objectPath = objectPathStr.split(".");
				let value = selectParams.entityParams;
				for(let name of objectPath){
					if(!value){
						throw new Error(`Entity "${objectPathStr}" not found.`);
					}
					value = value[name];
				}
				if(!(value instanceof QueryColumn)){
					throw new Error(`"${objectPathStr}" is not an entity.`);
				}
				sql += value.columnFullName;
			}else{
				sql += token.value;
			}
		}
		return sql
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
	public get sql(): string {
		return this.__sql;
	}
	public asJoinable(alias?: string): JoinableSelectWithFileds {
		if (!alias) alias = "JoinableSelect" + Select.aliasUid++;
		return this.createJoinableProxy(
			alias,
			new JoinableSelect(
				"(" + this.__sql + ") AS " + alias,
				alias,
				this.selectParams
			)
		);
	}
	private createJoinableProxy(
		alias: string,
		joinableSelect: JoinableSelect
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
					return new QueryColumn(null, alias, k);
				}
			},
		});
	}
	public get hasHardLimit(): boolean {
		return this.selectParams.limitSize != null;
	}
	public prepare(dbInterfaceConfig: DbInterfaceConfig): PreparedSelect {
		let [sql, paramNames] = getPositionalQuery(this.sql);
		return new PreparedSelect(dbInterfaceConfig.dbEngine, sql, paramNames);
	}
	public preparePaged(
		dbInterfaceConfig: DbInterfaceConfig
	): PreparedSelectPaged {
		if (this.hasHardLimit)
			throw new Error(
				"Pagination is not allowed for selects with hard limit."
			);
		let [sql, paramNames] = getPositionalQuery(this.sql);
		return new PreparedSelectPaged(
			dbInterfaceConfig.dbEngine,
			dbInterfaceConfig.getLimitByPageIndex,
			sql,
			paramNames
		);
	}
}

export class PreparedSelect extends PreparedQuery {
	public constructor(
		private dbEngine: IDbEngine,
		private sql: string,
		private paramNames: string[]
	) {
		super();
	}

	public run(params: any): Promise<any[]> {
		if (Array.isArray(params)) {
			return this.dbEngine.executeSelect(this.sql, params);
		} else {
			return this.dbEngine.executeSelect(
				this.sql,
				this.paramNames.map((p) => params[p])
			);
		}
	}
}

export class PreparedSelectPaged extends PreparedQuery {
	public constructor(
		private dbEngine: IDbEngine,
		private getLimitByPageIndex: (pageIndex: number) => [number, number],
		private sql: string,
		private paramNames: string[]
	) {
		super();
		this.sql += " LIMIT ?,?";
	}

	public run({
		params,
		pageIndex,
	}: {
		params: any;
		pageIndex: number;
	}): Promise<any[]> {
		if (Array.isArray(params)) {
			return this.dbEngine.executeSelect(
				this.sql,
				params.concat(this.getLimitByPageIndex(pageIndex))
			);
		} else {
			return this.dbEngine.executeSelect(
				this.sql,
				this.paramNames
					.map((p) => params[p])
					.concat(this.getLimitByPageIndex(pageIndex))
			);
		}
	}
}
