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
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			escapedDbName: "prove",
			unescapedDbName: "prove",
			escapedTableName: this.___alias,
			unescapedTableName: this.___alias,
			escapedColumnName: "id",
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		});
	}
	
	public get comune(): QueryColumn<"comune", string> {
		return new QueryColumn({
			escapedDbName: "prove",
			unescapedDbName: "prove",
			escapedTableName: this.___alias,
			unescapedTableName: this.___alias,
			escapedColumnName: "comune",
			unescapedColumnName: "comune",
			userColumnAlias: "comune",
			castValue: (value: any) => value,
		});
	}
	
	public get dataNascita(): QueryColumn<"dataNascita", Date> {
		return new QueryColumn({
			escapedDbName: "prove",
			unescapedDbName: "prove",
			escapedTableName: this.___alias,
			unescapedTableName: this.___alias,
			escapedColumnName: "data_nascita",
			unescapedColumnName: "data_nascita",
			userColumnAlias: "dataNascita",
			castValue: (value: any) => value,
		});
	}
	
	public get nome(): QueryColumn<"nome", string> {
		return new QueryColumn({
			escapedDbName: "prove",
			unescapedDbName: "prove",
			escapedTableName: this.___alias,
			unescapedTableName: this.___alias,
			escapedColumnName: "nome",
			unescapedColumnName: "nome",
			userColumnAlias: "nome",
			castValue: (value: any) => value,
		});
	}
	
	public get cognome(): QueryColumn<"cognome", string> {
		return new QueryColumn({
			escapedDbName: "prove",
			unescapedDbName: "prove",
			escapedTableName: this.___alias,
			unescapedTableName: this.___alias,
			escapedColumnName: "cognome",
			unescapedColumnName: "cognome",
			userColumnAlias: "cognome",
			castValue: (value: any) => value,
		});
	}
	protected get __primaryKey(): QueryColumn<string, any> | null {
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
	
	public get comune(): QueryColumn<"comune", string> {
		return new QueryColumn({
			escapedDbName: "prove",
			unescapedDbName: "prove",
			escapedTableName: this.__alias,
			unescapedTableName: this.__alias,
			escapedColumnName: "comune",
			unescapedColumnName: "comune",
			userColumnAlias: "comune",
			castValue: (value: any) => value,
		});
	}
	public get provincia(): QueryColumn<"provincia", string> {
		return new QueryColumn({
			escapedDbName: "prove",
			unescapedDbName: "prove",
			escapedTableName: this.__alias,
			unescapedTableName: this.__alias,
			escapedColumnName: "provincia",
			unescapedColumnName: "provincia",
			userColumnAlias: "provincia",
			castValue: (value: any) => value,
		});
	}
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			escapedDbName: "prove",
			unescapedDbName: "prove",
			escapedTableName: this.__alias,
			unescapedTableName: this.__alias,
			escapedColumnName: "id",
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		});
	}
	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}
}

export class ChkinIngressi extends Table {
	protected __alias: string;
	public constructor(alias?: string) {
		super();
		this.__alias = alias ?? "chkinIngressi";
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

	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}

	protected get __tableName(): string {
		return "chkin_ingressi";
	}
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			escapedDbName: "falegnameria",
			unescapedDbName: "falegnameria",
			escapedTableName: "chkin_ingressi",
			unescapedTableName: "chkin_ingressi",
			escapedColumnName: "id",
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		});
	}
	
	public get idUtente(): QueryColumn<"idUtente", string> {
		return new QueryColumn({
			escapedDbName: "falegnameria",
			unescapedDbName: "falegnameria",
			escapedTableName: "chkin_ingressi",
			unescapedTableName: "chkin_ingressi",
			escapedColumnName: "id_utente",
			unescapedColumnName: "id_utente",
			userColumnAlias: "idUtente",
			castValue: (value: any) => value,
		});
	}
	
	public get entrata(): QueryColumn<"entrata", string> {
		return new QueryColumn({
			escapedDbName: "falegnameria",
			unescapedDbName: "falegnameria",
			escapedTableName: "chkin_ingressi",
			unescapedTableName: "chkin_ingressi",
			escapedColumnName: "entrata",
			unescapedColumnName: "entrata",
			userColumnAlias: "entrata",
			castValue: (value: any) => value,
		});
	}
	
	public get uscita(): QueryColumn<"uscita", string> {
		return new QueryColumn({
			escapedDbName: "falegnameria",
			unescapedDbName: "falegnameria",
			escapedTableName: "chkin_ingressi",
			unescapedTableName: "chkin_ingressi",
			escapedColumnName: "uscita",
			unescapedColumnName: "uscita",
			userColumnAlias: "uscita",
			castValue: (value: any) => value,
		});
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

	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}

	protected get __tableName(): string {
		return "mng_utenti";
	}
	protected get __alias(): string {
		return this.___alias;
	}
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			escapedDbName: "falegnameria",
			unescapedDbName: "falegnameria",
			escapedTableName: this.__alias,
			unescapedTableName: this.__alias,
			escapedColumnName: "id",
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		});
	}
	
	public get username(): QueryColumn<"username", string> {
		return new QueryColumn({
			escapedDbName: "falegnameria",
			unescapedDbName: "falegnameria",
			escapedTableName: this.__alias,
			unescapedTableName: this.__alias,
			escapedColumnName: "username",
			unescapedColumnName: "username",
			userColumnAlias: "username",
			castValue: (value: any) => value,
		});
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

	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}

	protected get __tableName(): string {
		return "articoli";
	}
	
	protected get __alias(): string {
		return this.___alias;
	}
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli",
			unescapedTableName: "articoli",
			escapedColumnName: "id",
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		});
	}
	
	public get unitaMisura(): QueryColumn<"unitaMisura", number> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli",
			unescapedTableName: "articoli",
			escapedColumnName: "unita_misura",
			unescapedColumnName: "unita_misura",
			userColumnAlias: "unitaMisura",
			castValue: (value: any) => value,
		});
	}
	
	public get classificazione(): QueryColumn<"classificazione", number> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli",
			unescapedTableName: "articoli",
			escapedColumnName: "classificazione",
			unescapedColumnName: "classificazione",
			userColumnAlias: "classificazione",
			castValue: (value: any) => value,
		});
	}
	
	public get codice(): QueryColumn<"codice", string> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli",
			unescapedTableName: "articoli",
			escapedColumnName: "codice",
			unescapedColumnName: "codice",
			userColumnAlias: "codice",
			castValue: (value: any) => value,
		});
	}
	
	public get descrizione(): QueryColumn<"descrizione", string> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli",
			unescapedTableName: "articoli",
			escapedColumnName: "descrizione",
			unescapedColumnName: "descrizione",
			userColumnAlias: "descrizione",
			castValue: (value: any) => value,
		});
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
	
	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}
	
	protected get __tableName(): string {
		return "unita_di_misura";
	}
	
	protected get __alias(): string {
		return this.___alias;
	}
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "unita_di_misura",
			unescapedTableName: "unita_di_misura",
			escapedColumnName: "id",
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		});
	}
	
	public get simbolo(): QueryColumn<"simbolo", string> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "unita_di_misura",
			unescapedTableName: "unita_di_misura",
			escapedColumnName: "simbolo",
			unescapedColumnName: "simbolo",
			userColumnAlias: "simbolo",
			castValue: (value: any) => value,
		});
	}
	
	public get descrizione(): QueryColumn<"descrizione", string> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "unita_di_misura",
			unescapedTableName: "unita_di_misura",
			escapedColumnName: "descrizione",
			unescapedColumnName: "descrizione",
			userColumnAlias: "descrizione",
			castValue: (value: any) => value,
		});
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
	
	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}
	
	protected get __tableName(): string {
		return "articoli__classificazione";
	}
	
	protected get __alias(): string {
		return this.___alias;
	}
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli__classificazione",
			unescapedTableName: "articoli__classificazione",
			escapedColumnName: "id",
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		});
	}
	
	public get idParent(): QueryColumn<"idParent", string> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli__classificazione",
			unescapedTableName: "articoli__classificazione",
			escapedColumnName: "id_parent",
			unescapedColumnName: "id_parent",
			userColumnAlias: "idParent",
			castValue: (value: any) => value,
		});
	}
	
	public get path(): QueryColumn<"path", string> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli__classificazione",
			unescapedTableName: "articoli__classificazione",
			escapedColumnName: "path",
			unescapedColumnName: "path",
			userColumnAlias: "path",
			castValue: (value: any) => value,
		});
	}
	
	public get value(): QueryColumn<"value", string> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli__classificazione",
			unescapedTableName: "articoli__classificazione",
			escapedColumnName: "value",
			unescapedColumnName: "value",
			userColumnAlias: "value",
			castValue: (value: any) => value,
		});
	}
	
	public get fullDescPath(): QueryColumn<"fullDescPath", string> {
		return new QueryColumn({
			escapedDbName: "chimiclean",
			unescapedDbName: "chimiclean",
			escapedTableName: "articoli__classificazione",
			unescapedTableName: "articoli__classificazione",
			escapedColumnName: "full_desc_path",
			unescapedColumnName: "full_desc_path",
			userColumnAlias: "fullDescPath",
			castValue: (value: any) => value,
		});
	}
}