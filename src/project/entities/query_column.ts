import { BindableEnity } from "./bindable_enity";

export interface QueryColumnData<Name extends string, Ty> {
	rawTableName: string | undefined;
	unescapedTableName: string | undefined;
	unescapedColumnName: string;
	unescapedUserColumnAlias: Name;
	sqlValue?: string;
	castValue: (value: any) => Ty;
}

export type GenericQueryColumn = QueryColumn<string, any>;

export class QueryColumn<Name extends string, Ty> extends BindableEnity {
	public constructor(private data: QueryColumnData<Name, Ty>, private escapeFunction: (ident: string) => string) {
		super();
	}
	public get escapedRawTableName(): string | undefined {
		return this.data.rawTableName ? this.escapeFunction(this.data.rawTableName): undefined;
	}
	public get unescapedRawTableName(): string | undefined {
		return this.data.rawTableName;
	}
	public get escapedTableName(): string | undefined {
		return this.data.unescapedTableName ? this.escapeFunction(this.data.unescapedTableName) : undefined;
	}
	public get unescapedTableName(): string | undefined {
		return this.data.unescapedTableName;
	}
	public get escapedColumnName(): string {
		return this.escapeFunction(this.data.unescapedColumnName);
	}
	public get unescapedColumnName(): string {
		return this.data.unescapedColumnName;
	}
	public get escapedUserColumnAlias(): string {
		return this.escapeFunction(this.data.unescapedUserColumnAlias);
	}
	public get unescapedUserColumnAlias(): Name {
		return this.data.unescapedUserColumnAlias;
	}
	public get columnFullIdentifier(): string {
		return this.data.sqlValue ? this.data.sqlValue : (this.escapedTableName ? this.escapedTableName + "." : "") + this.escapedColumnName;
	}
	public get aliasedColumnFullIdentifier(): string {
		return this.escapedUserColumnAlias != this.escapedColumnName ? this.columnFullIdentifier + " AS " + this.escapedUserColumnAlias : this.columnFullIdentifier;
	}
	public castValue(value: any): Ty {
		return this.data.castValue(value);
	}
	public getData(): QueryColumnData<Name, Ty> {
		return {...this.data};
	}
	public as<A extends string>(alias: A): QueryColumn<A, Ty> {
		return new QueryColumn({
			unescapedTableName: this.data.unescapedTableName,
			unescapedColumnName: this.data.unescapedColumnName,
			rawTableName: this.data.rawTableName,
			unescapedUserColumnAlias: alias,
			castValue: this.data.castValue,
		}, this.escapeFunction);
	}
	protected get __enityBinding(): string {
		return this.columnFullIdentifier;
	}
	public static from<A extends string, Ty>(sqlValue: string, alias: A, escapeFunction: (ident: string) => string, castValue?: (value: any) => Ty): QueryColumn<A, Ty> {
		return new QueryColumn({
			rawTableName: undefined,
			unescapedTableName: undefined,
			unescapedColumnName: alias,
			unescapedUserColumnAlias: alias,
			sqlValue,
			castValue: castValue ?? (a => a),
		}, escapeFunction);
	}
	
}