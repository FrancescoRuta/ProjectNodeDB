import { GenericQueryColumn } from "./query_column";

export interface ForeignKey {
	column: GenericQueryColumn;
	tableName: string;
	ambiguous: boolean;
}