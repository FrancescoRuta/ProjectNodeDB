import { IDbEngine } from "./db_engine";
import { QueryColumn } from "./entities";
import { Delete, DeleteParams, PreparedDelete } from "./operations/delete";
import { Insert, InsertParams, PreparedInsert } from "./operations/insert";
import { ColTypeRecursion, PreparedSelect, PreparedSelectPaged, Select, SelectParams } from "./operations/select";
import { PreparedUpdate, Update, UpdateParams } from "./operations/update";
import { PreparedQuery } from "./prepared_query";

export type QueryType = "SELECT" | "SELECT_PAGED" | "INSERT" | "UPDATE" | "DELETE";
export type ExecuteBeforeArgs = {
	params: any,
	paramNames: string[] | number[],
	queryType: QueryType,
};
export type ExecuteBefore<T> = (args: ExecuteBeforeArgs) => T | undefined;

export interface DbInterfaceConfig<T, D> {
	dbEngine: IDbEngine<D>;
	pageIndexParam: string;
	getLimitByPageIndex: (pageIndex: number) => [number, number];
	expose: (options: T, queryType: QueryType, preparedQuery: PreparedQuery) => void;
	executeBefore?: <T>(next: ExecuteBefore<T> | undefined) => ExecuteBefore<T>;
}

export class DbInterface<T, D> {
	
	public constructor(private config: DbInterfaceConfig<T, D>) {
		config.executeBefore ??= (n) => ((args) => n ? n(args) : undefined);
	}
	
	public prepareInsert(insertParams: InsertParams<D>, executeBefore?: ExecuteBefore<void>): PreparedInsert<D> {
		return new Insert(insertParams).prepare(this.config, this.config.executeBefore!(executeBefore));
	}
	
	public prepareUpdate(updateParams: UpdateParams<D>, executeBefore?: ExecuteBefore<void>): PreparedUpdate<D> {
		return new Update(updateParams).prepare(this.config, this.config.executeBefore!(executeBefore));
	}
	
	public prepareDelete(deleteParams: DeleteParams<D>, executeBefore?: ExecuteBefore<void>): PreparedDelete<D> {
		return new Delete(deleteParams).prepare(this.config, this.config.executeBefore!(executeBefore));
	}
	
	public prepareSelect<F extends QueryColumn<string, any>[]>(selectParams: SelectParams<D, F>, executeBefore?: ExecuteBefore<void>): PreparedSelect<D, ColTypeRecursion<F>> {
		return new Select(selectParams).prepare(this.config, this.config.executeBefore!(executeBefore));
	}
	
	public prepareSelectPaged<F extends QueryColumn<string, any>[]>(selectParams: SelectParams<D, F>, executeBefore?: ExecuteBefore<number | undefined>): PreparedSelectPaged<D, ColTypeRecursion<F>> {
		return new Select(selectParams).preparePaged(this.config, executeBefore ?? (() => undefined));
	}
	
	public exposeInsert(options: T, insertParams: InsertParams<D>, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(options, "INSERT", new Insert(insertParams).prepare(this.config, this.config.executeBefore!(executeBefore)));
	}
	
	public exposeUpdate(options: T, updateParams: UpdateParams<D>, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(options, "UPDATE", new Update(updateParams).prepare(this.config, this.config.executeBefore!(executeBefore)));
	}
	
	public exposeDelete(options: T, deleteParams: DeleteParams<D>, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(options, "DELETE", new Delete(deleteParams).prepare(this.config, this.config.executeBefore!(executeBefore)));
	}
	
	public exposeSelect<F extends QueryColumn<string, any>[]>(options: T, selectParams: SelectParams<D, F>, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(options, "SELECT", new Select(selectParams).prepare(this.config, this.config.executeBefore!(executeBefore)));
	}
	
	public exposeSelectPaged<F extends QueryColumn<string, any>[]>(options: T, selectParams: SelectParams<D, F>, executeBefore?: ExecuteBefore<number | undefined>): void {
		this.config.expose(options, "SELECT_PAGED", new Select(selectParams).preparePaged(this.config, this.config.executeBefore!(executeBefore)));
	}
	
	public select<F extends QueryColumn<string, any>[]>(selectParams: SelectParams<D, F>, executeBefore?: ExecuteBefore<void>): Select<D, F> {
		return new Select(selectParams);
	}
	
}
