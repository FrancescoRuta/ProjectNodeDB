import { ForeignKey, QueryColumn, Table } from "./project/entities";

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

export class ChkinIngressi extends Table {
	protected ___alias: string;
	public constructor(alias?: string) {
		super();
		this.___alias = alias ?? this.__tableName;
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [
			{
				column: this.idUtente,
				tableName: "mng_utenti",
				ambiguous: false,
			},
		];
	}

	protected get __primaryKey(): QueryColumn {
		return this.id;
	}

	protected get __tableName(): string {
		return "chkin_ingressi";
	}
	protected get __alias(): string {
		return this.___alias;
	}

	public get id(): QueryColumn {
		return new QueryColumn("falegnameria", this.__alias, "id");
	}

	public get idUtente(): QueryColumn {
		return new QueryColumn("falegnameria", this.__alias, "id_utente");
	}

	public get entrata(): QueryColumn {
		return new QueryColumn("falegnameria", this.__alias, "entrata");
	}

	public get uscita(): QueryColumn {
		return new QueryColumn("falegnameria", this.__alias, "uscita");
	}
}

export class MngUtenti extends Table{
	protected ___alias: string;
	public constructor(alias?: string) {
		super();
		this.___alias = alias ?? this.__tableName;
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [];
	}

	protected get __primaryKey(): QueryColumn {
		return this.id;
	}

	protected get __tableName(): string {
		return "mng_utenti";
	}
	protected get __alias(): string {
		return this.___alias;
	}

	public get id(): QueryColumn {
		return new QueryColumn("falegnameria", this.__alias, "id");
	}

	public get username(): QueryColumn {
		return new QueryColumn("falegnameria", this.__alias, "username");
	}
}