import { IDbEngine } from "./db_engine";
import { GenericQueryColumn, QueryColumn } from "./entities";
import { Delete, DeleteParams, PreparedDelete } from "./operations/delete";
import { Insert, InsertParams, PreparedInsert } from "./operations/insert";
import { Select, SelectParams } from "./operations/select";
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
	
	public prepareSelect<F extends GenericQueryColumn[]>(selectParams: SelectParams<D, F>, executeBefore?: ExecuteBefore<void>) {
		return new Select(selectParams, this.config.dbEngine.escapeDbIdentifier).prepare(this.config, this.config.executeBefore!(executeBefore));
	}
	
	public prepareSelectPaged<F extends GenericQueryColumn[]>(selectParams: SelectParams<D, F>, executeBefore?: ExecuteBefore<number | undefined>) {
		return new Select(selectParams, this.config.dbEngine.escapeDbIdentifier).preparePaged(this.config, executeBefore ?? (() => undefined));
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
	
	public exposeSelect<F extends GenericQueryColumn[]>(options: T, selectParams: SelectParams<D, F>, executeBefore?: ExecuteBefore<void>): void {
		this.config.expose(options, "SELECT", this.prepareSelect(selectParams, executeBefore));
	}
	
	public exposeSelectPaged<F extends GenericQueryColumn[]>(options: T, selectParams: SelectParams<D, F>, executeBefore?: ExecuteBefore<number | undefined>): void {
		this.config.expose(options, "SELECT_PAGED", this.prepareSelectPaged(selectParams, executeBefore));
	}
	
	public select<F extends GenericQueryColumn[]>(selectParams: SelectParams<D, F>, alias?: string) {
		return new Select(selectParams, this.config.dbEngine.escapeDbIdentifier).asJoinable(alias);
	}
	
	public field<A extends string, Ty>(sqlValue: string, alias: A, castValue?: (value: any) => Ty): QueryColumn<A, Ty> {
		return QueryColumn.from(sqlValue, alias, this.config.dbEngine.escapeDbIdentifier, castValue);
	}
	
}
