type JoinKey = {
	column: QueryColumn<string, any>;
	tableName: string;
	ambiguous: boolean;
};

export interface ForeignKey {
	column: QueryColumn<string, any>;
	tableName: string;
	ambiguous: boolean;
}

export interface JoinablePrimaryKey {
	column: QueryColumn<string, any>;
	tableName: string;
	ambiguous: boolean;
}

export abstract class BindableEnity {
	protected abstract get __enityBinding(): string;
}

export interface QueryColumnData<Name extends string, Ty> {
	unescapedDbName?: string;
	unescapedTableName?: string;
	unescapedColumnName: string;
	userColumnAlias: Name;
	castValue: (value: any) => Ty;
}

export class QueryColumn<Name extends string, Ty> extends BindableEnity {
	public constructor(private data: QueryColumnData<Name, Ty>, private escapeFunction: (ident: string) => string) {
		super();
	}
	public get escapedDbName(): string | undefined {
		return this.data.unescapedDbName ? this.escapeFunction(this.data.unescapedDbName) : undefined;
	}
	public get unescapedDbName(): string | undefined {
		return this.data.unescapedDbName;
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
	public get userColumnAlias(): Name {
		return this.data.userColumnAlias;
	}
	public get columnFullIdentifier(): string {
		return (this.escapedTableName ? this.escapedTableName + "." : "") + (this.escapedTableName ? this.escapedTableName + "." : "") + this.escapedColumnName;
	}
	public get aliasedColumnFullIdentifier(): string {
		return this.data.userColumnAlias != this.escapedColumnName ? this.columnFullIdentifier + " AS " + this.data.userColumnAlias : this.columnFullIdentifier;
	}
	public castValue(value: any): Ty {
		return this.data.castValue(value);
	}
	public getData(): QueryColumnData<Name, Ty> {
		return {...this.data};
	}
	public as<A extends string>(alias: A): QueryColumn<A, Ty> {
		return new QueryColumn({
			unescapedDbName: this.data.unescapedDbName,
			unescapedTableName: this.data.unescapedTableName,
			unescapedColumnName: this.data.unescapedColumnName,
			userColumnAlias: alias,
			castValue: this.data.castValue,
		}, this.escapeFunction);
	}
	protected get __enityBinding(): string {
		return this.columnFullIdentifier;
	}
	public static from<A extends string, Ty>(str: string, alias: A, escapeFunction: (ident: string) => string, castValue?: (value: any) => Ty): QueryColumn<A, Ty> {
		return new QueryColumn({
			unescapedColumnName: alias,
			userColumnAlias: alias,
			castValue: castValue ?? (a => a),
		}, escapeFunction);
	}
	
}

export abstract class SqlFrom {
	protected abstract get __sqlFrom(): string;
}

export abstract class Joinable extends SqlFrom {
	protected abstract get __entityBindings(): any;
	protected abstract get __foreignKeys(): ForeignKey[];
	protected abstract get __primaryKeys(): JoinablePrimaryKey[];

	public innerJoin(
		other: Joinable,
		joinOn?: [QueryColumn<string, any>, QueryColumn<string, any>]
	): Joinable {
		return this.__genericJoin(other, "INNER", joinOn);
	}

	public leftJoin(
		other: Joinable,
		joinOn?: [QueryColumn<string, any>, QueryColumn<string, any>]
	): Joinable {
		return this.__genericJoin(other, "LEFT", joinOn);
	}

	public rightJoin(
		other: Joinable,
		joinOn?: [QueryColumn<string, any>, QueryColumn<string, any>]
	): Joinable {
		return this.__genericJoin(other, "RIGHT", joinOn);
	}

	public naturalJoin(other: Joinable): Joinable {
		let sql = `(${this.__sqlFrom}), (${other.__sqlFrom})`;
		return new JoinResult(
			this.__joinKeys(this.__foreignKeys, other.__foreignKeys),
			this.__joinKeys(this.__primaryKeys, other.__primaryKeys),
			sql,
			{...this.__entityBindings, ...other.__entityBindings},
		);
	}

	private __genericJoin(
		other: Joinable,
		joinType: "INNER" | "LEFT" | "RIGHT",
		joinOn?: [QueryColumn<string, any>, QueryColumn<string, any>]
	): Joinable {
		let joinOnStr: [string, string];
		if (!joinOn) {
			let ambiguousError = `Ambiguous join between "${this.__sqlFrom}" and "${other.__sqlFrom}"`;
			let joinOn1 = this.__findJoinableKeys(
				this.__primaryKeys,
				other.__foreignKeys,
				ambiguousError
			);
			let joinOn2 = this.__findJoinableKeys(
				other.__primaryKeys,
				this.__foreignKeys,
				ambiguousError
			);
			if (joinOn1 === null && joinOn2 === null) {
				throw new Error(
					`No valid join keys found between "${this.__sqlFrom}" and "${other.__sqlFrom}"`
				);
			}
			if (joinOn1 !== null && joinOn2 !== null) {
				throw new Error(ambiguousError);
			}
			joinOnStr = joinOn1 ?? joinOn2!;
		} else {
			joinOnStr = [joinOn[0].columnFullIdentifier, joinOn[1].columnFullIdentifier];
		}
		let sql = `(${this.__sqlFrom}) ${joinType} JOIN (${other.__sqlFrom}) ON ${joinOnStr[0]} = ${joinOnStr[1]}`;
		return new JoinResult(
			this.__joinKeys(this.__foreignKeys, other.__foreignKeys),
			this.__joinKeys(this.__primaryKeys, other.__primaryKeys),
			sql,
			{...this.__entityBindings, ...other.__entityBindings},
		);
	}

	private __joinKeys(keys1: JoinKey[], keys2: JoinKey[]): JoinKey[] {
		keys1 = this.__copy(keys1);
		let newKeys = [...keys1];
		for (let fk of keys2) {
			let isAmbiguous = false;
			for (let fk2 of keys1) {
				if (fk.tableName == fk2.tableName) {
					fk2.ambiguous = true;
					isAmbiguous = true;
					break;
				}
			}
			if (!isAmbiguous) {
				newKeys.push(this.__copy(fk));
			}
		}
		return newKeys;
	}

	private __findJoinableKeys(
		pks: JoinablePrimaryKey[],
		fks: ForeignKey[],
		error: string
	): [string, string] | null {
		let result: [string, string] | null = null;
		for (let pk of pks) {
			for (let fk of fks) {
				if (pk.tableName == fk.tableName) {
					if (pk.ambiguous || fk.ambiguous || result != null) {
						throw new Error(error);
					}
					result = [pk.column.columnFullIdentifier, fk.column.columnFullIdentifier];
				}
			}
		}
		return result;
	}

	private __copy<T extends JoinKey | JoinKey[]>(k: T): T {
		let result: any;
		if (Array.isArray(k)) {
			result = k.map(k => ({
				column: k.column,
				tableName: k.tableName,
				ambiguous: k.ambiguous,
			}));
		} else {
			result = {
				column: k.column,
				tableName: k.tableName,
				ambiguous: k.ambiguous,
			};
		}
		return result;
	}
}

export class JoinResult extends Joinable {
	public constructor(
		private foreignKeys: ForeignKey[],
		private primaryKeys: JoinablePrimaryKey[],
		private sqlFrom: string,
		private entityBindings: any,
	) {
		super();
	}
	protected get __foreignKeys(): ForeignKey[] {
		return this.foreignKeys;
	}
	protected get __primaryKeys(): JoinablePrimaryKey[] {
		return this.primaryKeys;
	}
	protected get __sqlFrom(): string {
		return this.sqlFrom;
	}
	protected get __entityBindings(): any {
		return this.entityBindings;
	}
}

export abstract class Table extends Joinable {
	protected abstract get __primaryKey(): QueryColumn<string, any> | null;
	protected abstract get __tableName(): string;
	protected abstract get __alias(): string;
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
		return this.__tableName == this.__alias
			? this.__tableName
			: this.__tableName + " AS " + this.__alias;
	}
	protected get __entityBindings(): any {
		let entityBinding: any = {};
		entityBinding[this.__alias] = this;
		return entityBinding;
	}
}
