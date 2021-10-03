import { ForeignKey, QueryColumn, Table } from "../project/entities";

export class Persone extends Table {
	protected __escapedAlias: string;
	protected __unescapedAlias: string;
	public constructor(alias?: string) {
		super();
		this.__unescapedAlias = alias ?? "persone";
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
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
			rawTableName: "persone",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "id",
			unescapedUserColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get comune(): QueryColumn<"comune", string> {
		return new QueryColumn({
			rawTableName: "persone",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "comune",
			unescapedUserColumnAlias: "comune",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get dataNascita(): QueryColumn<"dataNascita", Date> {
		return new QueryColumn({
			rawTableName: "persone",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "data_nascita",
			unescapedUserColumnAlias: "dataNascita",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get nome(): QueryColumn<"nome", string> {
		return new QueryColumn({
			rawTableName: "persone",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "nome",
			unescapedUserColumnAlias: "nome",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get cognome(): QueryColumn<"cognome", string> {
		return new QueryColumn({
			rawTableName: "persone",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "cognome",
			unescapedUserColumnAlias: "cognome",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}
}

export class Comuni extends Table {
	protected __escapedAlias: string;
	protected __unescapedAlias: string;
	public constructor(alias?: string) {
		super();
		this.__unescapedAlias = alias ?? "Comuni";
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
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
			rawTableName: "comuni",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "comune",
			unescapedUserColumnAlias: "comune",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	public get provincia(): QueryColumn<"provincia", string> {
		return new QueryColumn({
			rawTableName: "comuni",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "provincia",
			unescapedUserColumnAlias: "provincia",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			rawTableName: "comuni",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "id",
			unescapedUserColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	protected get __primaryKey(): QueryColumn<string, any> | null {
		return this.id;
	}
}

export class ChkinIngressi extends Table {
	protected __escapedAlias: string;
	protected __unescapedAlias: string;
	public constructor(alias?: string) {
		super();
		this.__unescapedAlias = alias ?? "chkinIngressi";
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
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
			rawTableName: "chkin_ingressi",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "id",
			unescapedUserColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get idUtente(): QueryColumn<"idUtente", string> {
		return new QueryColumn({
			rawTableName: "chkin_ingressi",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "id_utente",
			unescapedUserColumnAlias: "idUtente",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get entrata(): QueryColumn<"entrata", string> {
		return new QueryColumn({
			rawTableName: "chkin_ingressi",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "entrata",
			unescapedUserColumnAlias: "entrata",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get uscita(): QueryColumn<"uscita", string> {
		return new QueryColumn({
			rawTableName: "chkin_ingressi",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "uscita",
			unescapedUserColumnAlias: "uscita",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

export class MngUtenti extends Table{
	protected __escapedAlias: string;
	protected __unescapedAlias: string;
	public constructor(alias?: string) {
		super();
		this.__unescapedAlias = alias ?? "MngUtenti";
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
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
			rawTableName: "mng_utenti",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "id",
			unescapedUserColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get username(): QueryColumn<"username", string> {
		return new QueryColumn({
			rawTableName: "mng_utenti",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "username",
			unescapedUserColumnAlias: "username",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

export class Articoli extends Table{
	protected __escapedAlias: string;
	protected __unescapedAlias: string;
	public constructor(alias?: string) {
		super();
		this.__unescapedAlias = alias ?? "Articoli";
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
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
	
	public get All(): [typeof this.id, typeof this.unitaMisura] {
		return [this.id, this.unitaMisura];
	}
	
	public get id(): QueryColumn<"id", number> {
		return new QueryColumn({
			rawTableName: "articoli",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "id",
			unescapedUserColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get unitaMisura(): QueryColumn<"unitaMisura", number> {
		return new QueryColumn({
			rawTableName: "articoli",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "unita_misura",
			unescapedUserColumnAlias: "unitaMisura",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get classificazione(): QueryColumn<"classificazione", number> {
		return new QueryColumn({
			rawTableName: "articoli",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "classificazione",
			unescapedUserColumnAlias: "classificazione",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get codice(): QueryColumn<"codice", string> {
		return new QueryColumn({
			rawTableName: "articoli",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "codice",
			unescapedUserColumnAlias: "codice",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get descrizione(): QueryColumn<"descrizione", string> {
		return new QueryColumn({
			rawTableName: "articoli",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "descrizione",
			unescapedUserColumnAlias: "descrizione",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

export class UnitaDiMisura extends Table{
	protected __escapedAlias: string;
	protected __unescapedAlias: string;
	public constructor(alias?: string) {
		super();
		this.__unescapedAlias = alias ?? "UnitaDiMisura";
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
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
			rawTableName: "unita_di_misura",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "id",
			unescapedUserColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get simbolo(): QueryColumn<"simbolo", string> {
		return new QueryColumn({
			rawTableName: "unita_di_misura",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "simbolo",
			unescapedUserColumnAlias: "simbolo",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get descrizione(): QueryColumn<"descrizione", string> {
		return new QueryColumn({
			rawTableName: "unita_di_misura",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "descrizione",
			unescapedUserColumnAlias: "descrizione",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

export class ArticoliClassificazione extends Table{
	protected __escapedAlias: string;
	protected __unescapedAlias: string;
	public constructor(alias?: string) {
		super();
		this.__unescapedAlias = alias ?? "ArticoliClassificazione";
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
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
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "id",
			unescapedUserColumnAlias: "id",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get idParent(): QueryColumn<"idParent", string> {
		return new QueryColumn({
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "id_parent",
			unescapedUserColumnAlias: "idParent",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get path(): QueryColumn<"path", string> {
		return new QueryColumn({
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "path",
			unescapedUserColumnAlias: "path",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get value(): QueryColumn<"value", string> {
		return new QueryColumn({
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "value",
			unescapedUserColumnAlias: "value",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
	
	public get fullDescPath(): QueryColumn<"fullDescPath", string> {
		return new QueryColumn({
			rawTableName: "articoli__classificazione",
			unescapedTableName: this.__unescapedAlias,
			unescapedColumnName: "full_desc_path",
			unescapedUserColumnAlias: "fullDescPath",
			castValue: (value: any) => value,
		}, escapeFunction);
	}
}

function escapeFunction(ident: string): string {
	return "`" + ident.replace(/\`/gm, "``") + "`";
}