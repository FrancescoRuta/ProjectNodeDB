import { IDbEngine } from "./db_engine";
import { Table } from "./entities";
import { Delete, DeleteParams, PreparedDelete } from "./operations/delete";
import { Insert, InsertParams, PreparedInsert } from "./operations/insert";
import { PreparedSelect, PreparedSelectPaged, Select, SelectParams } from "./operations/select";
import { PreparedUpdate, Update, UpdateParams } from "./operations/update";
import { PreparedQuery } from "./prepared_query";

export type ExecuteBefore<T> = (params: any) => T;

export interface DbInterfaceConfig {
	dbEngine: IDbEngine;
	getLimitByPageIndex: (pageIndex: number) => [number, number];
	expose: (path: string, preparedQuery: PreparedQuery) => void;
}

export class DbInterface {
	
	public constructor(private config: DbInterfaceConfig) {}
	
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
	
	public exposeInsert(path: string, insertParams: InsertParams, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(path, new Insert(insertParams).prepare(this.config, executeBefore ?? (() => {})));
	}
	
	public exposeUpdate(path: string, updateParams: UpdateParams, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(path, new Update(updateParams).prepare(this.config, executeBefore ?? (() => {})));
	}
	
	public exposeDelete(path: string, deleteParams: DeleteParams, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(path, new Delete(deleteParams).prepare(this.config, executeBefore ?? (() => {})));
	}
	
	public exposeSelect(path: string, selectParams: SelectParams, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(path, new Select(selectParams).prepare(this.config, executeBefore ?? (() => {})));
	}
	
	public exposeSelectPaged(path: string, selectParams: SelectParams, executeBefore?: ExecuteBefore<number | undefined>): void {
		this.config.expose(path, new Select(selectParams).preparePaged(this.config, executeBefore ?? (() => undefined)));
	}
	
}
