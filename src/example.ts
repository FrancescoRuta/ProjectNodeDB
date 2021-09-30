import { ForeignKey, QueryColumn, Table } from "./entities";

export class Persone extends Table {
	protected ___alias: string;
	public constructor(alias?: string) {
		super();
		this.___alias = alias ?? this.__tableName;
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [
			{
				column: this.comune,
				tableName: "comuni",
				ambiguous: false,
			},
		];
	}

	protected get __tableName(): string {
		return "persone";
	}
	protected get __alias(): string {
		return this.___alias;
	}

	public get id(): QueryColumn {
		return new QueryColumn("prove", this.__alias, "id");
	}

	public get comune(): QueryColumn {
		return new QueryColumn("prove", this.__alias, "comune");
	}

	public get data_nascita(): QueryColumn {
		return new QueryColumn("prove", this.__alias, "data_nascita");
	}

	public get nome(): QueryColumn {
		return new QueryColumn("prove", this.__alias, "nome");
	}

	public get cognome(): QueryColumn {
		return new QueryColumn("prove", this.__alias, "cognome");
	}
	protected get __primaryKey(): QueryColumn {
		return this.id;
	}
}

export class Comuni extends Table {
	protected __alias: string;
	public constructor(alias?: string) {
		super();
		this.__alias = alias ?? this.__tableName;
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [
			{
				column: this.provincia,
				tableName: "comuni",
				ambiguous: false,
			},
		];
	}

	protected get __tableName(): string {
		return "comuni";
	}

	public get comune(): QueryColumn {
		return new QueryColumn("prove", this.__alias, "comune");
	}
	public get provincia(): QueryColumn {
		return new QueryColumn("prove", this.__alias, "provincia");
	}
	public get id(): QueryColumn {
		return new QueryColumn("prove", this.__alias, "id");
	}
	protected get __primaryKey(): QueryColumn {
		return this.id;
	}
}
