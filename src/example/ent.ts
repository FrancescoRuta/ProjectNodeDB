import { ForeignKey, GenericQueryColumn, QueryColumn, Table } from "../project/entities";

export class Persone<Alias extends string> extends Table<[QueryColumn<"id", number>, QueryColumn<"comune", string>, QueryColumn<"dataNascita", Date>, QueryColumn<"nome", string>, QueryColumn<"cognome", string>]> {
	protected __escapedAlias: string;
	protected __unescapedAlias: Alias;
	private constructor(alias: Alias) {
		super();
		this.__unescapedAlias = alias;
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
	}
	public static get(): Persone<"persone"> {
		return new Persone("persone");
	}
	public static as<Alias extends string>(alias: Alias): Persone<Alias> {
		return new Persone(alias);
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
	
	public get All(): [typeof this.id, typeof this.comune, typeof this.dataNascita, typeof this.nome, typeof this.cognome] {
		return [this.id, this.comune, this.dataNascita, this.nome, this.cognome];
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
	protected get __primaryKey(): GenericQueryColumn | null {
		return this.id;
	}
}

export class Comuni<Alias extends string> extends Table<[QueryColumn<"id", number>, QueryColumn<"comune", string>, QueryColumn<"provincia", string>]> {
	protected __escapedAlias: string;
	protected __unescapedAlias: Alias;
	private constructor(alias: Alias) {
		super();
		this.__unescapedAlias = alias;
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
	}
	public static get(): Comuni<"comuni"> {
		return new Comuni("comuni");
	}
	public static as<Alias extends string>(alias: Alias): Comuni<Alias> {
		return new Comuni(alias);
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
	
	public get All(): [typeof this.id, typeof this.comune, typeof this.provincia] {
		return [this.id, this.comune, this.provincia];
	}
	
	protected get __tableName(): string {
		return escapeFunction("comuni");
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
	protected get __primaryKey(): GenericQueryColumn | null {
		return this.id;
	}
}

export class ChkinIngressi<Alias extends string> extends Table<[QueryColumn<"id", number>, QueryColumn<"idUtente", string>, QueryColumn<"entrata", string>, QueryColumn<"uscita", string>]> {
	protected __escapedAlias: string;
	protected __unescapedAlias: Alias;
	private constructor(alias: Alias) {
		super();
		this.__unescapedAlias = alias;
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
	}
	public static get(): ChkinIngressi<"chkinIngressi"> {
		return new ChkinIngressi("chkinIngressi");
	}
	public static as<Alias extends string>(alias: Alias): ChkinIngressi<Alias> {
		return new ChkinIngressi(alias);
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

	protected get __primaryKey(): GenericQueryColumn | null {
		return this.id;
	}

	protected get __tableName(): string {
		return escapeFunction("chkin_ingressi");
	}
	
	public get All(): [typeof this.id, typeof this.idUtente, typeof this.entrata, typeof this.uscita] {
		return [this.id, this.idUtente, this.entrata, this.uscita];
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

export class MngUtenti<Alias extends string> extends Table<[QueryColumn<"id", number>, QueryColumn<"username", string>]> {
	protected __escapedAlias: string;
	protected __unescapedAlias: Alias;
	private constructor(alias: Alias) {
		super();
		this.__unescapedAlias = alias;
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
	}
	public static get(): MngUtenti<"mngUtenti"> {
		return new MngUtenti("mngUtenti");
	}
	public static as<Alias extends string>(alias: Alias): MngUtenti<Alias> {
		return new MngUtenti(alias);
	}

	protected get __foreignKeys(): ForeignKey[] {
		return [];
	}

	protected get __primaryKey(): GenericQueryColumn | null {
		return this.id;
	}

	protected get __tableName(): string {
		return escapeFunction("mng_utenti");
	}
	
	public get All(): [typeof this.id, typeof this.username] {
		return [this.id, this.username];
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

export class Articoli<Alias extends string> extends Table<[QueryColumn<"id", number>, QueryColumn<"unitaMisura", number>, QueryColumn<"classificazione", number>, QueryColumn<"codice", string>, QueryColumn<"descrizione", string>]> {
	protected __escapedAlias: string;
	protected __unescapedAlias: Alias;
	private constructor(alias: Alias) {
		super();
		this.__unescapedAlias = alias;
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
	}
	public static get(): Articoli<"articoli"> {
		return new Articoli("articoli");
	}
	public static as<Alias extends string>(alias: Alias): Articoli<Alias> {
		return new Articoli(alias);
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

	protected get __primaryKey(): GenericQueryColumn | null {
		return this.id;
	}

	protected get __tableName(): string {
		return escapeFunction("articoli");
	}
	
	public get All(): [typeof this.id, typeof this.unitaMisura, typeof this.classificazione, typeof this.codice, typeof this.descrizione] {
		return [this.id, this.unitaMisura, this.classificazione, this.codice, this.descrizione];
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

export class UnitaDiMisura<Alias extends string> extends Table<[QueryColumn<"id", number>, QueryColumn<"simbolo", string>, QueryColumn<"descrizione", string>]> {
	protected __escapedAlias: string;
	protected __unescapedAlias: Alias;
	private constructor(alias: Alias) {
		super();
		this.__unescapedAlias = alias;
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
	}
	public static get(): UnitaDiMisura<"unitaDiMisura"> {
		return new UnitaDiMisura("unitaDiMisura");
	}
	public static as<Alias extends string>(alias: Alias): UnitaDiMisura<Alias> {
		return new UnitaDiMisura(alias);
	}
	
	protected get __foreignKeys(): ForeignKey[] {
		return [];
	}
	
	protected get __primaryKey(): GenericQueryColumn | null {
		return this.id;
	}
	
	protected get __tableName(): string {
		return escapeFunction("unita_di_misura");
	}
	
	public get All(): [typeof this.id, typeof this.simbolo, typeof this.descrizione] {
		return [this.id, this.simbolo, this.descrizione];
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

export class ArticoliClassificazione<Alias extends string> extends Table<[QueryColumn<"id", number>, QueryColumn<"idParent", string>, QueryColumn<"path", string>, QueryColumn<"value", string>, QueryColumn<"fullDescPath", string>]> {
	protected __escapedAlias: string;
	protected __unescapedAlias: Alias;
	private constructor(alias: Alias) {
		super();
		this.__unescapedAlias = alias;
		this.__escapedAlias = escapeFunction(this.__unescapedAlias);
	}
	public static get(): ArticoliClassificazione<"articoliClassificazione"> {
		return new ArticoliClassificazione("articoliClassificazione");
	}
	public static as<Alias extends string>(alias: Alias): ArticoliClassificazione<Alias> {
		return new ArticoliClassificazione(alias);
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
	
	protected get __primaryKey(): GenericQueryColumn | null {
		return this.id;
	}
	
	protected get __tableName(): string {
		return escapeFunction("articoli__classificazione");
	}
	
	public get All(): [typeof  this.id, typeof  this.idParent, typeof  this.path, typeof  this.value, typeof  this.fullDescPath] {
		return [this.id, this.idParent, this.path, this.value, this.fullDescPath];
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