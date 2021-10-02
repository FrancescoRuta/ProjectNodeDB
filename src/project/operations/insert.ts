import { IDbEngine } from "../db_engine";
import { DbInterfaceConfig, ExecuteBefore } from "../db_interface";
import { QueryColumn, Table } from "../entities";
import { PreparedQuery } from "../prepared_query";
import { getPositionalQuery } from "../sql_helper";

export type InsertParams<D> = Table | {
	table: Table;
	fields?: (QueryColumn | [QueryColumn, string])[];
	dbEngineArgs?: D;
}

export class Insert<D> {
	private sql: string;
	private paramNames: string[];
	private dbEngineArgs: D | undefined;
	
	public constructor(insertParams: InsertParams<D>) {
		if (insertParams instanceof Table) insertParams = {table: insertParams};
		let { table, fields, dbEngineArgs } = insertParams;
		this.dbEngineArgs = dbEngineArgs;
		if (!fields) {
			let primaryKey: string = (<any>table).__primaryKey.columnName;
			let colNames: string[] = Object.getOwnPropertyNames(Object.getPrototypeOf(table)).filter(k => !k.startsWith("__") && k != "constructor" && k != primaryKey);
			fields = colNames.map(c => (<any>table)[c]).filter(k => k instanceof QueryColumn);
		}
		let aliases = fields.map(f => f instanceof QueryColumn ? `:${f.colVarName}:` : f[1]).join(",");
		let columns = fields.map(f => f instanceof QueryColumn ? f.columnName : f[0].colVarName).join(",");
		let tableName = (<any>table).__tableName;
		for (let f of fields) {
			if (!(f instanceof QueryColumn)) f = f[0];
			if (f.tableName != tableName)
				throw new Error(`Insert fields must be from "${tableName}" table.`);
		}
		let sql = `INSERT INTO ${tableName} (${columns}) VALUES (${aliases})`;
		[this.sql, this.paramNames] = getPositionalQuery(sql);
	}
	public prepare<T>(dbInterfaceConfig: DbInterfaceConfig<T, D>, executeBefore: ExecuteBefore<void>): PreparedInsert<D> {
		return new PreparedInsert(dbInterfaceConfig.dbEngine, this.sql, this.paramNames, executeBefore, this.dbEngineArgs);
	}
	
}

export class PreparedInsert<D> extends PreparedQuery {
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

	public run(params?: any): Promise<any> {
		if (Array.isArray(params)) {
			this.executeBefore({params, paramNames: this.paramIndexes, queryType: "INSERT"});
			return this.dbEngine.execute(this.sql, params, this.dbEngineArgs);
		} else {
		this.executeBefore({params, paramNames: this.paramNames, queryType: "INSERT"});
			return this.dbEngine.execute(
				this.sql,
				this.paramNames.map((p) => params[p]),
				this.dbEngineArgs
			);
		}
	}
}
