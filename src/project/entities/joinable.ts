import { ForeignKey } from "./foreign_key";
import { JoinablePrimaryKey } from "./joinable_primary_key";
import { GenericQueryColumn } from "./query_column";

type JoinKey = {
	column: GenericQueryColumn;
	tableName: string;
	ambiguous: boolean;
};

export abstract class SqlFrom {
	protected abstract get __sqlFrom(): string;
}

export abstract class Joinable<F extends GenericQueryColumn[]> extends SqlFrom {
	protected abstract get __entityBindings(): any;
	protected abstract get __foreignKeys(): ForeignKey[];
	protected abstract get __primaryKeys(): JoinablePrimaryKey[];
	public abstract get All(): [...F];
	
	public InnerJoin<A extends any[]>(
		other: Joinable<A>,
		joinOn?: [GenericQueryColumn, GenericQueryColumn]
	): Joinable<[...F, ...A]> {
		return this.__genericJoin(other, "INNER", joinOn);
	}

	public LeftJoin<A extends any[]>(
		other: Joinable<A>,
		joinOn?: [GenericQueryColumn, GenericQueryColumn]
	): Joinable<[...F, ...A]> {
		return this.__genericJoin(other, "LEFT", joinOn);
	}

	public RightJoin<A extends any[]>(
		other: Joinable<A>,
		joinOn?: [GenericQueryColumn, GenericQueryColumn]
	): Joinable<[...F, ...A]> {
		return this.__genericJoin(other, "RIGHT", joinOn);
	}

	public NaturalJoin<A extends any[]>(other: Joinable<A>): Joinable<[...F, ...A]> {
		let sql = `(${this.__sqlFrom}), (${other.__sqlFrom})`;
		return new JoinResult(
			this.__joinKeys(this.__foreignKeys, other.__foreignKeys),
			this.__joinKeys(this.__primaryKeys, other.__primaryKeys),
			sql,
			{...this.__entityBindings, ...other.__entityBindings},
			[...this.All, ...other.All],
		);
	}

	private __genericJoin<A extends any[]>(other: Joinable<A>, joinType: "INNER" | "LEFT" | "RIGHT", joinOn?: [GenericQueryColumn, GenericQueryColumn]): Joinable<[...F, ...A]> {
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
				console.error(this.__primaryKeys, this.__foreignKeys);
				throw new Error(`No valid join keys found between "${this.__sqlFrom}" and "${other.__sqlFrom}"`);
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
			[...this.All, ...other.All],
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

export class JoinResult<F extends any[]> extends Joinable<F> {
	public constructor(
		private foreignKeys: ForeignKey[],
		private primaryKeys: JoinablePrimaryKey[],
		private sqlFrom: string,
		private entityBindings: any,
		private all: [...F],
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
	public get All(): [...F] {
		return [...this.all];
	}
}