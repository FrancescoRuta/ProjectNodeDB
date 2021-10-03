import { ForeignKey, QueryColumn, Table } from "../project/entities";

export class Persone extends Table {
	protected __alias: string;
	public constructor(alias?: string) {
		super();
		this.__alias = alias ?? "persone";
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [
			{
				column: this.comune,
				tableName: escapeFunction("comuni"),
				ambiguous: false,
			},
		];
	}

	protected get __tableName(): string {
		return escapeFunction("persone");
	}
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			unescapedDbName: "prove",
			rawTableName: "persone",
			unescapedTableName: this.__alias,
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get comune(): QueryColumn<"comune", string> {
		return new QueryColumn({
			unescapedDbName: "prove",
			rawTableName: "persone",
			unescapedTableName: this.__alias,
			unescapedColumnName: "comune",
			userColumnAlias: "comune",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get dataNascita(): QueryColumn<"dataNascita", Date> {
		return new QueryColumn({
			unescapedDbName: "prove",
			rawTableName: "persone",
			unescapedTableName: this.__alias,
			unescapedColumnName: "data_nascita",
			userColumnAlias: "dataNascita",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get nome(): QueryColumn<"nome", string> {
		return new QueryColumn({
			unescapedDbName: "prove",
			rawTableName: "persone",
			unescapedTableName: this.__alias,
			unescapedColumnName: "nome",
			userColumnAlias: "nome",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get cognome(): QueryColumn<"cognome", string> {
		return new QueryColumn({
			unescapedDbName: "prove",
			rawTableName: "persone",
			unescapedTableName: this.__alias,
			unescapedColumnName: "cognome",
			userColumnAlias: "cognome",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}
}

export class Comuni extends Table {
	protected __alias: string;
	public constructor(alias?: string) {
		super();
		this.__alias = alias ?? "Comuni";
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [
			{
				column: this.provincia,
				tableName: escapeFunction("comuni"),
				ambiguous: false,
			},
		];
	}

	protected get __tableName(): string {
		return escapeFunction("comuni");
	}
	
	public get comune(): QueryColumn<"comune", string> {
		return new QueryColumn({
			unescapedDbName: "prove",
			rawTableName: "comuni",
			unescapedTableName: this.__alias,
			unescapedColumnName: "comune",
			userColumnAlias: "comune",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	public get provincia(): QueryColumn<"provincia", string> {
		return new QueryColumn({
			unescapedDbName: "prove",
			rawTableName: "comuni",
			unescapedTableName: this.__alias,
			unescapedColumnName: "provincia",
			userColumnAlias: "provincia",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			unescapedDbName: "prove",
			rawTableName: "comuni",
			unescapedTableName: this.__alias,
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
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
				tableName: escapeFunction("mng_utenti"),
				ambiguous: false,
			},
		];
	}

	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}

	protected get __tableName(): string {
		return escapeFunction("chkin_ingressi");
	}
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			unescapedDbName: "falegnameria",
			rawTableName: "chkin_ingressi",
			unescapedTableName: this.__alias,
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get idUtente(): QueryColumn<"idUtente", string> {
		return new QueryColumn({
			unescapedDbName: "falegnameria",
			rawTableName: "chkin_ingressi",
			unescapedTableName: this.__alias,
			unescapedColumnName: "id_utente",
			userColumnAlias: "idUtente",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get entrata(): QueryColumn<"entrata", string> {
		return new QueryColumn({
			unescapedDbName: "falegnameria",
			rawTableName: "chkin_ingressi",
			unescapedTableName: this.__alias,
			unescapedColumnName: "entrata",
			userColumnAlias: "entrata",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get uscita(): QueryColumn<"uscita", string> {
		return new QueryColumn({
			unescapedDbName: "falegnameria",
			rawTableName: "chkin_ingressi",
			unescapedTableName: this.__alias,
			unescapedColumnName: "uscita",
			userColumnAlias: "uscita",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

export class MngUtenti extends Table{
	protected __alias: string;
	public constructor(alias?: string) {
		super();
		this.__alias = alias ?? "MngUtenti";
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [];
	}

	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}

	protected get __tableName(): string {
		return escapeFunction("mng_utenti");
	}
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			unescapedDbName: "falegnameria",
			rawTableName: "mng_utenti",
			unescapedTableName: this.__alias,
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get username(): QueryColumn<"username", string> {
		return new QueryColumn({
			unescapedDbName: "falegnameria",
			rawTableName: "mng_utenti",
			unescapedTableName: this.__alias,
			unescapedColumnName: "username",
			userColumnAlias: "username",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

export class Articoli extends Table{
	protected __alias: string;
	public constructor(alias?: string) {
		super();
		this.__alias = alias ?? "Articoli";
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [
			{
				column: this.unitaMisura,
				tableName: escapeFunction("unita_di_misura"),
				ambiguous: false,
			}, {
				column: this.classificazione,
				tableName: escapeFunction("articoli__classificazione"),
				ambiguous: false,
			}
		];
	}

	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}

	protected get __tableName(): string {
		return escapeFunction("articoli");
	}
	
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli",
			unescapedTableName: this.__alias,
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get unitaMisura(): QueryColumn<"unitaMisura", number> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli",
			unescapedTableName: this.__alias,
			unescapedColumnName: "unita_misura",
			userColumnAlias: "unitaMisura",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get classificazione(): QueryColumn<"classificazione", number> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli",
			unescapedTableName: this.__alias,
			unescapedColumnName: "classificazione",
			userColumnAlias: "classificazione",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get codice(): QueryColumn<"codice", string> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli",
			unescapedTableName: this.__alias,
			unescapedColumnName: "codice",
			userColumnAlias: "codice",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get descrizione(): QueryColumn<"descrizione", string> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli",
			unescapedTableName: this.__alias,
			unescapedColumnName: "descrizione",
			userColumnAlias: "descrizione",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

export class UnitaDiMisura extends Table{
	protected __alias: string;
	public constructor(alias?: string) {
		super();
		this.__alias = alias ?? "UnitaDiMisura";
	}
	
	protected get __foreignKeys(): ForeignKey[] {
		return [];
	}
	
	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}
	
	protected get __tableName(): string {
		return escapeFunction("unita_di_misura");
	}
	
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "unita_di_misura",
			unescapedTableName: this.__alias,
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get simbolo(): QueryColumn<"simbolo", string> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "unita_di_misura",
			unescapedTableName: this.__alias,
			unescapedColumnName: "simbolo",
			userColumnAlias: "simbolo",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get descrizione(): QueryColumn<"descrizione", string> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "unita_di_misura",
			unescapedTableName: this.__alias,
			unescapedColumnName: "descrizione",
			userColumnAlias: "descrizione",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

export class ArticoliClassificazione extends Table{
	protected __alias: string;
	public constructor(alias?: string) {
		super();
		this.__alias = alias ?? "ArticoliClassificazione";
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
		return escapeFunction("articoli__classificazione");
	}
	
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__alias,
			unescapedColumnName: "id",
			userColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get idParent(): QueryColumn<"idParent", string> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__alias,
			unescapedColumnName: "id_parent",
			userColumnAlias: "idParent",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get path(): QueryColumn<"path", string> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__alias,
			unescapedColumnName: "path",
			userColumnAlias: "path",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get value(): QueryColumn<"value", string> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__alias,
			unescapedColumnName: "value",
			userColumnAlias: "value",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get fullDescPath(): QueryColumn<"fullDescPath", string> {
		return new QueryColumn({
			unescapedDbName: "chimiclean",
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__alias,
			unescapedColumnName: "full_desc_path",
			userColumnAlias: "fullDescPath",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

function escapeFunction(ident: string): string {
	return "`" + ident.replace(/\`/gm, "``") + "`";
}