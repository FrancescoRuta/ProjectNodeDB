import { IDbEngine } from "../db_engine";
import { DbInterfaceConfig, ExecuteBefore } from "../db_interface";
import { QueryColumn, Table } from "../entities";
import { PreparedQuery } from "../prepared_query";
import { getPositionalQuery } from "../sql_helper";

export type InsertParams<D> = Table | {
	table: Table;
	ignorePrimaryKeyFromAutoDetectedFields?: boolean;
	fields?: QueryColumn | QueryColumn[];
	dbEngineArgs?: D;
}

export class Insert<D> {
	private sql: string;
	private paramNames: string[];
	private dbEngineArgs: D | undefined;
	
	public constructor(insertParams: InsertParams<D>) {
		if (insertParams instanceof Table) insertParams = {table: insertParams};
		let { table, fields, ignorePrimaryKeyFromAutoDetectedFields, dbEngineArgs } = insertParams;
		this.dbEngineArgs = dbEngineArgs;
		if (ignorePrimaryKeyFromAutoDetectedFields == null) ignorePrimaryKeyFromAutoDetectedFields = true;
		if (!fields) {
			let colNames: string[] = Object.getOwnPropertyNames(Object.getPrototypeOf(table)).filter(k => !k.startsWith("__") && k != "constructor");
			if (ignorePrimaryKeyFromAutoDetectedFields) {
				let primaryKey: QueryColumn = (<any>table).__primaryKey;
				let index = colNames.indexOf(primaryKey.columnName);
				if (index >= 0) colNames.splice(index, 1);
			}
			fields = colNames.map(c => (<any>table)[c]).filter(k => k instanceof QueryColumn);
		} else if (!Array.isArray(fields)) {
			fields = [fields];
		}
		let aliases = fields.map(f => `:${f.colVarName}:`).join(",");
		let columns = fields.map(f => f.columnName).join(",");
		let tableName = (<any>table).__tableName;
		for (let f of fields)
			if (f.tableName != tableName)
				throw new Error(`Insert fields must be from "${tableName}" table.`);
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
