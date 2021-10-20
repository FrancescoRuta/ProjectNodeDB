import { ForeignKey } from "./foreign_key";
import { Joinable } from "./joinable";
import { JoinablePrimaryKey } from "./joinable_primary_key";
import { GenericQueryColumn } from "./query_column";

export type GenericTable = Table<GenericQueryColumn[]>;
export abstract class Table<Columns extends GenericQueryColumn[]> extends Joinable<Columns> {
	protected abstract get __primaryKey(): GenericQueryColumn | null;
	protected abstract get __tableName(): string;
	protected abstract get __escapedAlias(): string;
	protected abstract get __unescapedAlias(): string;
	protected abstract get __foreignKeys(): ForeignKey[];
	protected get __primaryKeys(): JoinablePrimaryKey[] {
		if (this.__primaryKey == null) return [];
		return [
			{
				column: this.__primaryKey,
				tableName: this.__tableName,
				ambiguous: false,
			},
		];
	}
	protected get __sqlFrom(): string {
		return this.__tableName == this.__escapedAlias
			? this.__tableName
			: this.__tableName + " AS " + this.__escapedAlias;
	}
	protected get __entityBindings(): any {
		let entityBinding: any = {};
		entityBinding[this.__escapedAlias] = this;
		return entityBinding;
	}
}