import { IDbEngine } from "../db_engine";
import { DbInterfaceConfig, ExecuteBefore } from "../db_interface";
import { QueryColumn, Table } from "../entities";
import { PreparedQuery } from "../prepared_query";
import { getPositionalQuery, replaceColumnPlaceholders } from "../sql_helper";

export type UpdateParams = Table | {
	table: Table;
	fields?: QueryColumn | QueryColumn[];
	where?: string;
}

export class Update {
	private sql: string;
	private paramNames: string[];
	
	public constructor(updateParams: UpdateParams) {
		if (updateParams instanceof Table) updateParams = {table: updateParams};
		let { table, fields, where } = updateParams;
		let tableName: string = (<any>table).__tableName;
		let primaryKey: QueryColumn = (<any>table).__primaryKey;
		if (!fields) {
			let colNames: string[] = Object.getOwnPropertyNames(Object.getPrototypeOf(table)).filter(k => !k.startsWith("__") && k != "constructor" && k != primaryKey.columnName);
			fields = colNames.map(c => (<any>table)[c]).filter(k => k instanceof QueryColumn);
		} else if (!Array.isArray(fields)) {
			fields = [fields];
		}
		if (!where) {
			where = `${primaryKey.columnName}=:${primaryKey.columnName}:`;
		}
		let sets = fields.map(f => `${f.columnName}=:${f.colVarName}:`).join(",");
		for (let f of fields)
			if (f.tableName != tableName)
				throw new Error(`Update fields must be from "${tableName}" table.`);
		let sql = `UPDATE ${tableName} SET ${sets} WHERE ${where}`;
		sql = replaceColumnPlaceholders(sql, table);
		[this.sql, this.paramNames] = getPositionalQuery(sql);
	}
	public prepare<T>(dbInterfaceConfig: DbInterfaceConfig<T>, executeBefore: ExecuteBefore<void>): PreparedUpdate {
		return new PreparedUpdate(dbInterfaceConfig.dbEngine, this.sql, this.paramNames, executeBefore);
	}
	
}

export class PreparedUpdate extends PreparedQuery {
	private paramIndexes: number[];
	public constructor(
		private dbEngine: IDbEngine,
		private sql: string,
		private paramNames: string[],
		private executeBefore: ExecuteBefore<void>,
	) {
		super();
		this.paramIndexes = paramNames.map((_, i) => i);
	}

	public run(params?: any): Promise<any> {
		if (Array.isArray(params)) {
			this.executeBefore({params, paramNames: this.paramIndexes, queryType: "UPDATE"});
			return this.dbEngine.execute(this.sql, params);
		} else {
			this.executeBefore({params, paramNames: this.paramNames, queryType: "UPDATE"});
			return this.dbEngine.execute(
				this.sql,
				this.paramNames.map((p) => params[p])
			);
		}
	}
}
