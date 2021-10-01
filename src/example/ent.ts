import { ForeignKey, QueryColumn, Table } from "../project/entities";

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

export class Articoli extends Table{
	protected ___alias: string;
	public constructor(alias?: string) {
		super();
		this.___alias = alias ?? this.__tableName;
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [
			{
				column: this.unitaMisura,
				tableName: "unita_di_misura",
				ambiguous: false,
			}, {
				column: this.classificazione,
				tableName: "articoli__classificazione",
				ambiguous: false,
			}
		];
	}

	protected get __primaryKey(): QueryColumn {
		return this.id;
	}

	protected get __tableName(): string {
		return "articoli";
	}
	
	protected get __alias(): string {
		return this.___alias;
	}
	
	public get id(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "id");
	}
	
	public get unitaMisura(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "unita_misura");
	}
	
	public get classificazione(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "classificazione");
	}
	
	public get codice(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "codice");
	}
	
	public get descrizione(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "descrizione");
	}
}

export class UnitaDiMisura extends Table{
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
		return "unita_di_misura";
	}
	
	protected get __alias(): string {
		return this.___alias;
	}
	
	public get id(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "id");
	}
	
	public get simbolo(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "simbolo");
	}
	
	public get descrizione(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "descrizione");
	}
}

export class ArticoliClassificazione extends Table{
	protected ___alias: string;
	public constructor(alias?: string) {
		super();
		this.___alias = alias ?? this.__tableName;
	}
	
	protected get __foreignKeys(): ForeignKey[] {
		return [
			{
				column: this.idParent,
				tableName: this.__tableName,
				ambiguous: false,
			}
		];
	}
	
	protected get __primaryKey(): QueryColumn {
		return this.id;
	}
	
	protected get __tableName(): string {
		return "articoli__classificazione";
	}
	
	protected get __alias(): string {
		return this.___alias;
	}
	
	public get id(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "id");
	}
	
	public get idParent(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "id_parent");
	}
	
	public get path(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "path");
	}
	
	public get value(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "value");
	}
	
	public get fullDescPath(): QueryColumn {
		return new QueryColumn("chimiclean", this.__alias, "full_desc_path");
	}
}