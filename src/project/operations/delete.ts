import { IDbEngine } from "../db_engine";
import { DbInterfaceConfig, ExecuteBefore } from "../db_interface";
import { QueryColumn, Table } from "../entities";
import { PreparedQuery } from "../prepared_query";
import { getPositionalQuery, replaceColumnPlaceholders } from "../sql_helper";

export type DeleteParams = Table | {
	table: Table;
	where?: string;
}

export class Delete {
	private sql: string;
	private paramNames: string[];
	
	public constructor(deleteParams: DeleteParams) {
		if (deleteParams instanceof Table) deleteParams = {table: deleteParams};
		let { table, where } = deleteParams;
		let tableName: string = (<any>table).__tableName;
		let primaryKey: QueryColumn = (<any>table).__primaryKey;
		if (!where) {
			where = `${primaryKey.columnName}=:${primaryKey.columnName}:`;
		}
		let sql = `DELETE ${tableName} WHERE ${where}`;
		sql = replaceColumnPlaceholders(sql, table);
		[this.sql, this.paramNames] = getPositionalQuery(sql);
	}
	public prepare<T>(dbInterfaceConfig: DbInterfaceConfig<T>, executeBefore: ExecuteBefore<void>): PreparedDelete {
		return new PreparedDelete(dbInterfaceConfig.dbEngine, this.sql, this.paramNames, executeBefore);
	}
	
}

export class PreparedDelete extends PreparedQuery {
	public constructor(
		private dbEngine: IDbEngine,
		private sql: string,
		private paramNames: string[],
		private executeBefore: ExecuteBefore<void>
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
