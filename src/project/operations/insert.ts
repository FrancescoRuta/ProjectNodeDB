import { IDbEngine } from "../db_engine";
import { DbInterfaceConfig, ExecuteBefore } from "../db_interface";
import { QueryColumn, Table } from "../entities";
import { PreparedQuery } from "../prepared_query";
import { getPositionalQuery } from "../sql_helper";

export type InsertParams = Table | {
	table: Table;
	fields?: QueryColumn | QueryColumn[];
}

export class Insert {
	private sql: string;
	private paramNames: string[];
	
	public constructor(insertParams: InsertParams) {
		if (insertParams instanceof Table) insertParams = {table: insertParams};
		let { table, fields } = insertParams;
		if (!fields) {
			let colNames: string[] = Object.getOwnPropertyNames(Object.getPrototypeOf(table)).filter(k => !k.startsWith("__") && k != "constructor");
			fields = colNames.map(c => (<any>table)[c]).filter(k => k instanceof QueryColumn);
		} else if (!Array.isArray(fields)) {
			fields = [fields];
		}
		let aliases = fields.map(f => `:${f.alias ?? f.columnName}:`).join(",");
		let columns = fields.map(f => f.columnName).join(",");
		let tableName = (<any>table).__tableName;
		for (let f of fields)
			if (f.tableName != tableName)
				throw new Error(`Insert fields must be from "${tableName}" table.`);
		let sql = `INSERT INTO ${tableName} (${columns}) VALUES (${aliases})`;
		[this.sql, this.paramNames] = getPositionalQuery(sql);
	}
	public prepare<T>(dbInterfaceConfig: DbInterfaceConfig<T>, executeBefore: ExecuteBefore<void>): PreparedInsert {
		return new PreparedInsert(dbInterfaceConfig.dbEngine, this.sql, this.paramNames, executeBefore);
	}
	
}

export class PreparedInsert extends PreparedQuery {
	public constructor(
		private dbEngine: IDbEngine,
		private sql: string,
		private paramNames: string[],
		private executeBefore: ExecuteBefore<void>,
	) {
		super();
	}

	public run(params?: any): Promise<any> {
		this.executeBefore(params);
		if (Array.isArray(params)) {
			return this.dbEngine.execute(this.sql, params);
		} else {
			return this.dbEngine.execute(
				this.sql,
				this.paramNames.map((p) => params[p])
			);
		}
	}
}
