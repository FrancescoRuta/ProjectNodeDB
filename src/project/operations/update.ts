import { IDbEngine } from "../db_engine";
import { DbInterfaceConfig, ExecuteBefore } from "../db_interface";
import { QueryColumn, Table } from "../entities";
import { PreparedQuery } from "../prepared_query";
import { getPositionalQuery, replaceColumnPlaceholders } from "../sql_helper";

export type UpdateParams<D> = Table | {
	table: Table;
	fields?: (QueryColumn | [QueryColumn, string])[];
	where?: string;
	dbEngineArgs?: D;
}

export class Update<D> {
	private sql: string;
	private paramNames: string[];
	private dbEngineArgs: D | undefined;
	
	public constructor(updateParams: UpdateParams<D>) {
		if (updateParams instanceof Table) updateParams = {table: updateParams};
		let { table, fields, where, dbEngineArgs } = updateParams;
		this.dbEngineArgs = dbEngineArgs;
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
		let sets = fields.map(f => f instanceof QueryColumn ? `${f.columnName}=:${f.colVarName}:` : `${f[0].columnName}=:${f[1]}:`).join(",");
		for (let f of fields) {
			if (!(f instanceof QueryColumn)) f = f[0];
			if (f.tableName != tableName)
				throw new Error(`Update fields must be from "${tableName}" table.`);
		}
		let sql = `UPDATE ${tableName} SET ${sets} WHERE ${where}`;
		sql = replaceColumnPlaceholders(sql, table);
		[this.sql, this.paramNames] = getPositionalQuery(sql);
	}
	public prepare<T>(dbInterfaceConfig: DbInterfaceConfig<T, D>, executeBefore: ExecuteBefore<void>): PreparedUpdate<D> {
		return new PreparedUpdate(dbInterfaceConfig.dbEngine, this.sql, this.paramNames, executeBefore, this.dbEngineArgs);
	}
	
}

export class PreparedUpdate<D> extends PreparedQuery {
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
			this.executeBefore({params, paramNames: this.paramIndexes, queryType: "UPDATE"});
			return this.dbEngine.execute(this.sql, params, this.dbEngineArgs);
		} else {
			this.executeBefore({params, paramNames: this.paramNames, queryType: "UPDATE"});
			return this.dbEngine.execute(
				this.sql,
				this.paramNames.map((p) => params[p]),
				this.dbEngineArgs
			);
		}
	}
}
