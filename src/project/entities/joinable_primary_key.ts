import { GenericQueryColumn } from "./query_column";

export interface JoinablePrimaryKey {
	column: GenericQueryColumn;
	tableName: string;
	ambiguous: boolean;
}
