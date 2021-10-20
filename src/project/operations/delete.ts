import { IDbEngine } from "../db_engine";
import { DbInterfaceConfig, ExecuteBefore } from "../db_interface";
import { GenericQueryColumn } from "../entities/query_column";
import { GenericTable, Table } from "../entities/table";
import { PreparedQuery } from "../prepared_query";
import { getPositionalQuery, replaceColumnPlaceholders } from "../sql_helper";

export type DeleteParams<D> = GenericTable | {
	table: GenericTable;
	where?: string;
	dbEngineArgs?: D;
}

export class Delete<D> {
	private sql: string;
	private paramNames: string[];
	private dbEngineArgs: D | undefined;
	
	public constructor(deleteParams: DeleteParams<D>) {
		if (deleteParams instanceof Table) deleteParams = {table: deleteParams};
		let { table, where, dbEngineArgs } = deleteParams;
		this.dbEngineArgs = dbEngineArgs;
		let tableName: string = (<any>table).__tableName;
		let primaryKey: GenericQueryColumn = (<any>table).__primaryKey;
		if (!where) {
			where = `${primaryKey.columnFullIdentifier}=:${primaryKey.columnFullIdentifier}:`;
		}
		let sql = `DELETE ${tableName} WHERE ${where}`;
		sql = replaceColumnPlaceholders(sql, table);
		[this.sql, this.paramNames] = getPositionalQuery(sql);
	}
	public prepare<T>(dbInterfaceConfig: DbInterfaceConfig<T, D>, executeBefore: ExecuteBefore<void>): PreparedDelete<D> {
		return new PreparedDelete(dbInterfaceConfig.dbEngine, this.sql, this.paramNames, executeBefore, this.dbEngineArgs);
	}
	
}

export class PreparedDelete<D> extends PreparedQuery {
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
			this.executeBefore({params, paramNames: this.paramIndexes, queryType: "DELETE"});
			return this.dbEngine.execute(this.sql, params, this.dbEngineArgs);
		} else {
			this.executeBefore({params, paramNames: this.paramNames, queryType: "DELETE"});
			return this.dbEngine.execute(
				this.sql,
				this.paramNames.map((p) => params[p]),
				this.dbEngineArgs
			);
		}
	}
}
