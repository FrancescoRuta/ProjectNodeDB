type JoinKey = {
	column: QueryColumn;
	tableName: string;
	ambiguous: boolean;
};

export interface ForeignKey {
	column: QueryColumn;
	tableName: string;
	ambiguous: boolean;
}

export interface JoinablePrimaryKey {
	column: QueryColumn;
	tableName: string;
	ambiguous: boolean;
}

//sql formulas MUST have an alias (?)
export class QueryColumn {
	private __alias: string | null;
	public constructor(private db: string | null, private table: string | null, private col: string) {
		this.__alias = null;
	}
	public get columnName(): string {
		return this.col;
	}
	public get columnFullName(): string {
		return (this.db ? this.db + "." : "") + (this.table ? this.table + "." : "") + this.col;
	}
	public get alias(): string | null {
		return this.__alias;
	}
	public get aliasedColumn(): string {
		return this.__alias ? this.columnFullName + " AS " + this.__alias : this.columnFullName;
	}
	public as(alias: string): QueryColumn {
		let q = new QueryColumn(this.db, this.table, this.col);
		q.__alias = alias;
		return q;
	}
}

export abstract class SqlFrom {
	protected abstract get __sqlFrom(): string;
}

export abstract class Joinable extends SqlFrom {
	protected abstract get __foreignKeys(): ForeignKey[];
	protected abstract get __primaryKeys(): JoinablePrimaryKey[];

	public innerJoin(
		other: Joinable,
		joinOn?: [QueryColumn, QueryColumn]
	): Joinable {
		return this.genericJoin(other, "INNER", joinOn);
	}

	public leftJoin(
		other: Joinable,
		joinOn?: [QueryColumn, QueryColumn]
	): Joinable {
		return this.genericJoin(other, "LEFT", joinOn);
	}

	public rightJoin(
		other: Joinable,
		joinOn?: [QueryColumn, QueryColumn]
	): Joinable {
		return this.genericJoin(other, "RIGHT", joinOn);
	}

	public naturalJoin(other: Joinable): Joinable {
		let sql = `(${this.__sqlFrom}), (${other.__sqlFrom})`;
		return new JoinResult(
			this.joinKeys(this.__foreignKeys, other.__foreignKeys),
			this.joinKeys(this.__primaryKeys, other.__primaryKeys),
			sql
		);
	}

	private genericJoin(
		other: Joinable,
		joinType: "INNER" | "LEFT" | "RIGHT",
		joinOn?: [QueryColumn, QueryColumn]
	): Joinable {
		let joinOnStr: [string, string];
		if (!joinOn) {
			let ambiguousError = `Ambiguous join between "${this.__sqlFrom}" and "${other.__sqlFrom}"`;
			let joinOn1 = this.findJoinableKeys(
				this.__primaryKeys,
				other.__foreignKeys,
				ambiguousError
			);
			let joinOn2 = this.findJoinableKeys(
				other.__primaryKeys,
				this.__foreignKeys,
				ambiguousError
			);
			if (joinOn1 == null && joinOn2 == null) {
				throw new Error(
					`No valid join keys found between "${this.__sqlFrom}" and "${other.__sqlFrom}"`
				);
			}
			if (joinOn1 != null && joinOn2 != null) {
				throw new Error(ambiguousError);
			}
			joinOnStr = joinOn1 ?? joinOn2!;
		} else {
			joinOnStr = [joinOn[0].columnFullName, joinOn[1].columnFullName];
		}
		let sql = `(${this.__sqlFrom}) ${joinType} JOIN (${other.__sqlFrom}) ON ${joinOnStr[0]} = ${joinOnStr[1]}`;
		return new JoinResult(
			this.joinKeys(this.__foreignKeys, other.__foreignKeys),
			this.joinKeys(this.__primaryKeys, other.__primaryKeys),
			sql
		);
	}

	private joinKeys(keys1: JoinKey[], keys2: JoinKey[]): JoinKey[] {
		keys1 = keys1.map(this.copy);
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
				newKeys.push(this.copy(fk));
			}
		}
		return newKeys;
	}

	private findJoinableKeys(
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
					result = [pk.column.columnFullName, fk.column.columnFullName];
				}
			}
		}
		return result;
	}

	private copy<T>(target: T): T {
		//TODO: fix
		return JSON.parse(JSON.stringify(target));
	}
}

export class JoinResult extends Joinable {
	public constructor(
		private foreignKeys: ForeignKey[],
		private primaryKeys: JoinablePrimaryKey[],
		private sqlFrom: string
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
}

export abstract class Table extends Joinable {
	protected abstract get __primaryKey(): QueryColumn;
	protected abstract get __tableName(): string;
	protected abstract get __alias(): string;
	protected get __primaryKeys(): JoinablePrimaryKey[] {
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
}
