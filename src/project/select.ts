import { IDbEngine } from "./db_engine";
import { DbInterfaceConfig } from "./db_interface";
import { ForeignKey, Joinable, JoinablePrimaryKey, QueryColumn, SqlFrom } from "./entities";
import { PreparedQuery } from "./prepared_query";
import { getPositionalQuery } from "./sql_helper";

export type JoinableSelectWithFileds = Joinable & {
	[col: string]: QueryColumn
};

export interface SelectParams {
	from: Joinable;
	fields?: QueryColumn[];
	where?: string;
	groupBy?: string;
	having?: string;
	orderBy?: QueryColumn | QueryColumn[];
	limitOffset?: number;
	limitSize?: number;
}

class JoinableSelect extends Joinable {
	private foreignKeys: ForeignKey[];
	private primaryKeys: JoinablePrimaryKey[];
	public constructor(
		private sql: string,
		alias: string,
		selectParams: SelectParams,
	) {
		super();
		let { __foreignKeys, __primaryKeys }: { __foreignKeys: ForeignKey[], __primaryKeys: JoinablePrimaryKey[] } = <any>selectParams.from;
		[__foreignKeys, __primaryKeys] = this.filterKeys(selectParams.fields, alias, __foreignKeys, __primaryKeys);
		this.foreignKeys = __foreignKeys;
		this.primaryKeys = __primaryKeys;
	}
	private filterKeys(fields: QueryColumn[] | undefined, alias: string, __foreignKeys: ForeignKey[], __primaryKeys: JoinablePrimaryKey[]): [ForeignKey[], JoinablePrimaryKey[]] {
		if (fields) {
			let fks = [];
			let pks = [];
			for (let field of fields) {
				let fk = __foreignKeys.find(fk => field.columnFullName == fk.column.columnFullName);
				let pk = __primaryKeys.find(pk => field.columnFullName == pk.column.columnFullName);
				if (fk) fks.push({
					column: new QueryColumn(null, alias, field.alias ? field.alias : field.columnName),
					tableName: fk.tableName,
					ambiguous: fk.ambiguous,
				});
				if (pk) pks.push({
					column: new QueryColumn(null, alias, field.alias ? field.alias : field.columnName),
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
		let fields: string = selectParams.fields ? selectParams.fields.map(a => a.aliasedColumn).join(",") : "*";
		let {
			from,
			limitOffset,
			limitSize,
			where,
			groupBy,
			having,
			orderBy,
		} = selectParams;
	
		where = where ? "WHERE " + where : "";
		groupBy = groupBy ? "GROUP BY " + groupBy : "";
		having = having ? "HAVING " + having : "";
		let orderByStr = "";
		if (orderBy) {
			if (Array.isArray(orderBy)) {
				orderByStr = "ORDER BY " + orderBy.map((a) => a.columnFullName).join(",");
			} else {
				orderByStr = "ORDER BY " + orderBy.columnFullName;
			}
		}
	
		let limit = limitSize ? `LIMIT ${limitOffset ? limitOffset + "," : ""}${limitSize}` : "";
		let sql = `SELECT ${fields} FROM ${(<any>from).__sqlFrom} ${where} ${groupBy} ${having} ${orderByStr} ${limit}`;
		
		return sql.replace(/\s+/gm, " ").replace(/\s*\(\s*/gm, " (").replace(/\s*\)\s*/gm, ") ").trim();
	}
	public get sql(): string {
		return this.__sql;
	}
	public asJoinable(alias?: string): JoinableSelectWithFileds {
		if (!alias) alias = "JoinableSelect" + Select.aliasUid++;
		return this.createJoinableProxy(alias, new JoinableSelect("(" + this.__sql + ") AS " + alias, alias, this.selectParams));
	}
	private createJoinableProxy(alias: string, joinableSelect: JoinableSelect): any {
		return new Proxy(joinableSelect, {
			get: (target: any, key) => {
				let k = key.toString();
				if (k.startsWith("__") || k == "innerJoin" || k == "leftJoin" || k == "rightJoin" || k == "naturalJoin") {
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
	public preparePaged(dbInterfaceConfig: DbInterfaceConfig): PreparedSelectPaged {
		if (this.hasHardLimit) throw new Error("Pagination is not allowed for selects with hard limit.");
		let [sql, paramNames] = getPositionalQuery(this.sql);
		return new PreparedSelectPaged(dbInterfaceConfig.dbEngine, dbInterfaceConfig.getLimitByPageIndex, sql, paramNames);
	}
	
}

export class PreparedSelect extends PreparedQuery {
	public constructor(private dbEngine: IDbEngine, private sql: string, private paramNames: string[]) {
		super();
	}
	
	public run(params: any): Promise<any[]> {
		if (Array.isArray(params)) {
			return this.dbEngine.executeSelect(this.sql, params);
		} else {
			return this.dbEngine.executeSelect(this.sql, this.paramNames.map(p => params[p]));
		}
	}
}

export class PreparedSelectPaged extends PreparedQuery {
	public constructor(private dbEngine: IDbEngine, private getLimitByPageIndex: (pageIndex: number) => [number, number], private sql: string, private paramNames: string[]) {
		super();
		this.sql += " LIMIT ?,?";
	}
	
	public run({params, pageIndex}: {params: any, pageIndex: number}): Promise<any[]> {
		if (Array.isArray(params)) {
			return this.dbEngine.executeSelect(this.sql, params.concat(this.getLimitByPageIndex(pageIndex)));
		} else {
			return this.dbEngine.executeSelect(this.sql, this.paramNames.map(p => params[p]).concat(this.getLimitByPageIndex(pageIndex)));
		}
	}
}