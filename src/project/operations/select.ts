import { IDbEngine } from "../db_engine";
import { DbInterfaceConfig, ExecuteBefore } from "../db_interface";
import { BindableEnity } from "../entities/bindable_enity";
import { ForeignKey } from "../entities/foreign_key";
import { Joinable } from "../entities/joinable";
import { JoinablePrimaryKey } from "../entities/joinable_primary_key";
import { GenericQueryColumn, QueryColumn } from "../entities/query_column";
import { PreparedQuery } from "../prepared_query";
import { getPositionalQuery, replaceColumnPlaceholders } from "../sql_helper";

export type JoinableSelectWithFileds<F extends GenericQueryColumn[], A> = Joinable<F> & A;

export type ObjKeyMap<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
export type ColTypeRecursionToQueryColumn<A extends readonly [...any[]]> =
	A extends [
		infer L0,  infer L1,  infer L2,  infer L3,  infer L4,  infer L5,  infer L6,  infer L7,  infer L8,  infer L9,  infer L10, infer L11,
		infer L12, infer L13, infer L14, infer L15, infer L16, infer L17, infer L18, infer L19, infer L20, infer L21, infer L22, infer L23,
		infer L24, infer L25, infer L26, infer L27, infer L28, infer L29, infer L30, infer L31, infer L32, infer L33, infer L34, infer L35,
		infer L36, infer L37, infer L38, infer L39, infer L40, infer L41, infer L42, infer L43, infer L44, infer L45, infer L46, infer L47, ...infer R] ? (
		ColTypeRecursionToQueryColumn<[L0,  L1,  L2,  L3,  L4,  L5,  L6,  L7,  L8,  L9,  L10, L11]> &
		ColTypeRecursionToQueryColumn<[L12, L13, L14, L15, L16, L17, L18, L19, L20, L21, L22, L23]> &
		ColTypeRecursionToQueryColumn<[L24, L25, L26, L27, L28, L29, L30, L31, L32, L33, L34, L35]> &
		ColTypeRecursionToQueryColumn<[L36, L37, L38, L39, L40, L41, L42, L43, L44, L45, L46, L47]> &
		ColTypeRecursionToQueryColumn<R>
	)
	:
	A extends [infer L0, infer L1, infer L2, infer L3, infer L4, infer L5, infer L6, infer L7, infer L8, infer L9, infer L10, infer L11, ...infer R] ? (
		L0 extends QueryColumn<infer N, infer T> ? (
			{[J in N]: QueryColumn<N, T>} & ColTypeRecursionToQueryColumn<[L1, L2, L3, L4, L5, L6, L7, L8, L9, L10, L11]> & ColTypeRecursionToQueryColumn<R>
		) : never
	)
	:
	A extends [infer L, ...infer R] ? (
		L extends QueryColumn<infer N, infer T> ? {[J in N]: QueryColumn<N, T>} & ColTypeRecursionToQueryColumn<R> : never
	)
: unknown;
export type ColTypeRecursion<A extends readonly [...any[]]> =
	A extends [
		infer L0,  infer L1,  infer L2,  infer L3,  infer L4,  infer L5,  infer L6,  infer L7,  infer L8,  infer L9,  infer L10, infer L11,
		infer L12, infer L13, infer L14, infer L15, infer L16, infer L17, infer L18, infer L19, infer L20, infer L21, infer L22, infer L23,
		infer L24, infer L25, infer L26, infer L27, infer L28, infer L29, infer L30, infer L31, infer L32, infer L33, infer L34, infer L35,
		infer L36, infer L37, infer L38, infer L39, infer L40, infer L41, infer L42, infer L43, infer L44, infer L45, infer L46, infer L47, ...infer R] ? (
		ColTypeRecursion<[L0,  L1,  L2,  L3,  L4,  L5,  L6,  L7,  L8,  L9,  L10, L11]> &
		ColTypeRecursion<[L12, L13, L14, L15, L16, L17, L18, L19, L20, L21, L22, L23]> &
		ColTypeRecursion<[L24, L25, L26, L27, L28, L29, L30, L31, L32, L33, L34, L35]> &
		ColTypeRecursion<[L36, L37, L38, L39, L40, L41, L42, L43, L44, L45, L46, L47]> &
		ColTypeRecursion<R>
	)
	:
	A extends [infer L0, infer L1, infer L2, infer L3, infer L4, infer L5, infer L6, infer L7, infer L8, infer L9, infer L10, infer L11, ...infer R] ? (
		L0 extends QueryColumn<infer N, infer T> ? (
			{[J in N]: T} & ColTypeRecursion<[L1, L2, L3, L4, L5, L6, L7, L8, L9, L10, L11]> & ColTypeRecursion<R>
		) : never
	)
	:
	A extends [infer L, ...infer R] ? (
		L extends QueryColumn<infer N, infer T> ? {[J in N]: T} & ColTypeRecursion<R> : never
	)
: unknown;

export interface SelectParams<D, F extends GenericQueryColumn[]> {
	from: Joinable<GenericQueryColumn[]>;
	fields: [...F];
	where?: string;
	groupBy?: GenericQueryColumn | string | (GenericQueryColumn | string)[];
	having?: string;
	orderBy?: GenericQueryColumn | string | (GenericQueryColumn | string)[];
	limitOffset?: number;
	limitSize?: number;
	additionalBindableEntities?: any;
	dbEngineArgs?: D;
}

class JoinableSelect<D, F extends GenericQueryColumn[]> extends Joinable<F> {
	protected __foreignKeys: ForeignKey[];
	protected __primaryKeys: JoinablePrimaryKey[];
	public constructor(private sql: string, private __alias: string, private __selectParams: SelectParams<D, F>, private ___entityBindings: any, private __escapeFunction: (ident: string) => string, private __all: [...F]) {
		super();
		let fields = Array.isArray(__selectParams.fields) ? __selectParams.fields : [__selectParams.fields];
		let { __foreignKeys, __primaryKeys }: { __foreignKeys: ForeignKey[], __primaryKeys: JoinablePrimaryKey[] } = <any>__selectParams.from;
		[this.__foreignKeys, this.__primaryKeys] = this.filterKeys(fields, __alias, __foreignKeys, __primaryKeys);
	}
	public get All(): [...F] {
		return this.__all;
	}
	private filterKeys(fields: GenericQueryColumn[], alias: string, __foreignKeys: ForeignKey[], __primaryKeys: JoinablePrimaryKey[]): [ForeignKey[], JoinablePrimaryKey[]] {
		let fks: ForeignKey[] = [];
		let pks = [];
		for (let field of fields) {
			let fk = __foreignKeys.find(fk => field.columnFullIdentifier == fk.column.columnFullIdentifier);
			let pk = __primaryKeys.find(pk => field.columnFullIdentifier == pk.column.columnFullIdentifier);
			if (fk) {
				//field is a foreign key
				let data = field.getData();
				data.unescapedTableName = alias;
				data.unescapedColumnName = data.unescapedUserColumnAlias;
				data.unescapedUserColumnAlias;
				fks.push({
					column: new QueryColumn(data, this.__escapeFunction),
					tableName: fk.tableName,
					ambiguous: fk.ambiguous,
				});
			}
			if (pk) {
				//field is a primary key
				let data = field.getData();
				data.unescapedTableName = alias;
				data.unescapedColumnName = data.unescapedUserColumnAlias;
				data.unescapedUserColumnAlias;
				pks.push({
					column: new QueryColumn(data, this.__escapeFunction),
					tableName: pk.tableName,
					ambiguous: pk.ambiguous,
				});
			}
		}
		__foreignKeys = fks;
		__primaryKeys = pks;
		return [__foreignKeys, __primaryKeys];
	}
	protected get __entityBindings(): any {
		return this.___entityBindings;
	}
	protected get __sqlFrom(): string {
		return this.sql;
	}
}

export class Select<D, F extends GenericQueryColumn[]> extends BindableEnity {
	private __sql: string;
	private static aliasUid = 0;
	public constructor(private selectParams: SelectParams<D, F>, private escapeFunction: (ident: string) => string) {
		super();
		this.__sql = this.computeSql();
	}
	private computeSql(): string {
		let fieldsArr = (Array.isArray(this.selectParams.fields) ? this.selectParams.fields : [this.selectParams.fields]);
		let fields: string = fieldsArr.map(a => a.aliasedColumnFullIdentifier).join(",");
		let { from, limitOffset, limitSize, where, groupBy, having, orderBy } = this.selectParams;

		let limit = limitSize ? ` LIMIT ${limitOffset ? limitOffset + "," : ""}${limitSize}` : "";

		let sql =
			"SELECT " +
			fields +
			" FROM " +
			(<any>from).__sqlFrom +
			this.clauseToString("WHERE", where) +
			this.clauseToString("GROUP BY", groupBy) +
			this.clauseToString("HAVING", having) +
			this.clauseToString("ORDER BY", orderBy) +
			limit;

		
		return replaceColumnPlaceholders(sql, {...(<any>from).__entityBindings, ...this.selectParams.additionalBindableEntities})
			.replace(/\s+/gm, " ")
			.replace(/\s*\(\s*/gm, "(")
			.replace(/\s*\)\s*/gm, ")")
			.trim();
	}

	private clauseToString(clause: "GROUP BY" | "ORDER BY" | "WHERE" | "HAVING", content: undefined | GenericQueryColumn | string | (GenericQueryColumn | string)[]): string {
		if (!content) return "";
		let result: string;
		if (Array.isArray(content)) {
			result = content.map(a => a instanceof QueryColumn ? a.columnFullIdentifier : a).join(",");
		} else if (content instanceof QueryColumn) {
			result = content.columnFullIdentifier;
		} else {
			result = content;
		}

		return ` ${clause} ${result}`;
	}
	public asJoinable(alias?: string) {
		if (!alias) alias = "JoinableSelect" + Select.aliasUid++;
		let entityBinding: any = {};
		let all: any = this.selectParams.fields.map(f => {
			let data = f.getData();
			data.rawTableName = alias;
			data.unescapedTableName = alias;
			data.unescapedColumnName = data.unescapedUserColumnAlias;
			return new QueryColumn(data, this.escapeFunction);
		});
		let res = this.createJoinableProxy(
			alias,
			new JoinableSelect(
				"(" + this.__sql + ") AS " + this.escapeFunction(alias),
				alias,
				this.selectParams,
				entityBinding,
				this.escapeFunction,
				all
			),
			all
		);
		entityBinding[alias] = res;
		return res as JoinableSelectWithFileds<F, ObjKeyMap<ColTypeRecursionToQueryColumn<F>>>;
	}
	private createJoinableProxy(alias: string, joinableSelect: JoinableSelect<D, F>, all: GenericQueryColumn[]): any {
		let fields: {[a: string]: GenericQueryColumn} = {};
		for (let f of all) {
			fields[f.unescapedUserColumnAlias] = f;
		}
		return new Proxy(joinableSelect, {
			get: (target: any, key) => {
				let k = key.toString();
				if (fields[k]) {
					return fields[k];
				} else {
					return target[key];
				}
			},
		});
	}
	public get hasHardLimit(): boolean {
		return this.selectParams.limitSize != null;
	}
	public prepare<T>(dbInterfaceConfig: DbInterfaceConfig<T, D>, executeBefore: ExecuteBefore<void>): PreparedSelect<D, ObjKeyMap<ColTypeRecursion<F>>> {
		let [sql, paramNames] = getPositionalQuery(this.__sql);
		return new PreparedSelect(dbInterfaceConfig.dbEngine, sql, paramNames, executeBefore, this.selectParams.dbEngineArgs);
	}
	public preparePaged<T>(dbInterfaceConfig: DbInterfaceConfig<T, D>, executeBefore: ExecuteBefore<number | undefined>): PreparedSelectPaged<D, ObjKeyMap<ColTypeRecursion<F>>> {
		if (this.hasHardLimit)
			throw new Error(
				"Pagination is not allowed for selects with hard limit."
			);
		let [sql, paramNames] = getPositionalQuery(this.__sql);
		return new PreparedSelectPaged(
			dbInterfaceConfig.dbEngine,
			dbInterfaceConfig.pageIndexParam,
			dbInterfaceConfig.getLimitByPageIndex,
			sql,
			paramNames,
			executeBefore,
			this.selectParams.dbEngineArgs
		);
	}
	protected get __enityBinding(): string {
		return `(${this.__sql})`;
	}
}

export class PreparedSelect<D, F> extends PreparedQuery {
	private paramIndexes: number[];
	public constructor(
		private dbEngine: IDbEngine<D>,
		private sql: string,
		private paramNames: string[],
		private executeBefore: ExecuteBefore<void>,
		private dbEngineArgs: D | undefined,
	) {
		super();
		this.paramIndexes = paramNames.map((_, i) => i);
	}

	public run(params?: any): Promise<F[]> {
		if (Array.isArray(params)) {
			this.executeBefore({params, paramNames: this.paramIndexes, queryType: "SELECT"});
			return this.dbEngine.executeSelect(this.sql, params, this.dbEngineArgs);
		} else {
			this.executeBefore({params, paramNames: this.paramNames, queryType: "SELECT"});
			return this.dbEngine.executeSelect(
				this.sql,
				this.paramNames.map((p) => params[p]),
				this.dbEngineArgs
			);
		}
	}
}

export class PreparedSelectPaged<D, F> extends PreparedQuery {
	private paramIndexes: number[];
	public constructor(
		private dbEngine: IDbEngine<D>,
		private pageIndexParam: string,
		private getLimitByPageIndex: (pageIndex: number) => [number, number],
		private sql: string,
		private paramNames: string[],
		private executeBefore: ExecuteBefore<number | undefined>,
		private dbEngineArgs: D | undefined,
	) {
		super();
		this.paramIndexes = paramNames.map((_, i) => i);
		this.sql += " LIMIT ?,?";
	}

	public run(params?: any): Promise<F[]> {
		if (Array.isArray(params)) {
			let pageIndex = params[params.length - 1];
			let executeBeforeResult = this.executeBefore({params, paramNames: this.paramIndexes, queryType: "SELECT_PAGED"});
			pageIndex = pageIndex ?? executeBeforeResult;
			pageIndex ??= 0;
			if (pageIndex < 0) pageIndex = 0;
			return this.dbEngine.executeSelect(
				this.sql,
				params.concat(this.getLimitByPageIndex(pageIndex)),
				this.dbEngineArgs
			);
		} else {
			let pageIndex = params[this.pageIndexParam];
			let executeBeforeResult = this.executeBefore({params, paramNames: this.paramNames, queryType: "SELECT_PAGED"});
			pageIndex = pageIndex ?? executeBeforeResult;
			pageIndex ??= 0;
			if (pageIndex < 0) pageIndex = 0;
			return this.dbEngine.executeSelect(
				this.sql,
				this.paramNames
					.map((p) => params[p])
					.concat(this.getLimitByPageIndex(pageIndex)),
					this.dbEngineArgs
			);
		}
	}
}
