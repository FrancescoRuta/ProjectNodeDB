import { IDbEngine } from "./db_engine";
import { Table } from "./entities";
import { Delete, DeleteParams, PreparedDelete } from "./operations/delete";
import { Insert, InsertParams, PreparedInsert } from "./operations/insert";
import { PreparedSelect, PreparedSelectPaged, Select, SelectParams } from "./operations/select";
import { PreparedUpdate, Update, UpdateParams } from "./operations/update";
import { PreparedQuery } from "./prepared_query";

export type ExecuteBefore<T> = (params: any) => T;
export type QueryType = "SELECT" | "SELECT_PAGED" | "INSERT" | "UPDATE" | "DELETE";

export interface DbInterfaceConfig<T> {
	dbEngine: IDbEngine;
	pageIndexParam: string;
	getLimitByPageIndex: (pageIndex: number) => [number, number];
	expose: (options: T, queryType: QueryType, preparedQuery: PreparedQuery) => void;
}

export class DbInterface<T> {
	
	public constructor(private config: DbInterfaceConfig<T>) {}
	
	public prepareInsert(insertParams: InsertParams, executeBefore?: ExecuteBefore<void>): PreparedInsert {
		return new Insert(insertParams).prepare(this.config, executeBefore ?? (() => {}));
	}
	
	public prepareUpdate(updateParams: UpdateParams, executeBefore?: ExecuteBefore<void>): PreparedUpdate {
		return new Update(updateParams).prepare(this.config, executeBefore ?? (() => {}));
	}
	
	public prepareDelete(deleteParams: DeleteParams, executeBefore?: ExecuteBefore<void>): PreparedDelete {
		return new Delete(deleteParams).prepare(this.config, executeBefore ?? (() => {}));
	}
	
	public prepareSelect(selectParams: SelectParams, executeBefore?: ExecuteBefore<void>): PreparedSelect {
		return new Select(selectParams).prepare(this.config, executeBefore ?? (() => {}));
	}
	
	public prepareSelectPaged(selectParams: SelectParams, executeBefore?: ExecuteBefore<number | undefined>): PreparedSelectPaged {
		return new Select(selectParams).preparePaged(this.config, executeBefore ?? (() => undefined));
	}
	
	public exposeInsert(options: T, insertParams: InsertParams, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(options, "INSERT", new Insert(insertParams).prepare(this.config, executeBefore ?? (() => {})));
	}
	
	public exposeUpdate(options: T, updateParams: UpdateParams, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(options, "UPDATE", new Update(updateParams).prepare(this.config, executeBefore ?? (() => {})));
	}
	
	public exposeDelete(options: T, deleteParams: DeleteParams, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(options, "DELETE", new Delete(deleteParams).prepare(this.config, executeBefore ?? (() => {})));
	}
	
	public exposeSelect(options: T, selectParams: SelectParams, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(options, "SELECT", new Select(selectParams).prepare(this.config, executeBefore ?? (() => {})));
	}
	
	public exposeSelectPaged(options: T, selectParams: SelectParams, executeBefore?: ExecuteBefore<number | undefined>): void {
		this.config.expose(options, "SELECT_PAGED", new Select(selectParams).preparePaged(this.config, executeBefore ?? (() => undefined)));
	}
	
}
