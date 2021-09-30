import { PAGE_SIZE } from "./config";
import { ForeignKey, Joinable, JoinablePrimaryKey, QueryColumn, SqlFrom } from "./entities";

export type JoinableSelectWithFileds = Joinable & {
	[col: string]: QueryColumn
};

export interface SelectParams {
	from: Joinable;
	fields?: QueryColumn[];
	where?: string;
	groupBy?: string;
	having?: string;
	orderBy?: QueryColumn | QueryColumn[];
	pageIndex?: number;
	limitOffset?: number;
	limitSize?: number;
}

export class JoinableSelect extends Joinable {
	private foreignKeys: ForeignKey[];
	private primaryKeys: JoinablePrimaryKey[];
	public constructor(
		private sql: string,
		alias: string,
		selectParams: SelectParams,
	) {
		super();
		let { __foreignKeys, __primaryKeys }: { __foreignKeys: ForeignKey[], __primaryKeys: JoinablePrimaryKey[] } = <any>selectParams.from;
		[__foreignKeys, __primaryKeys] = this.filterKeys(selectParams.fields, alias, __foreignKeys, __primaryKeys);
		this.foreignKeys = __foreignKeys;
		this.primaryKeys = __primaryKeys;
	}
	private filterKeys(fields: QueryColumn[] | undefined, alias: string, __foreignKeys: ForeignKey[], __primaryKeys: JoinablePrimaryKey[]): [ForeignKey[], JoinablePrimaryKey[]] {
		if (fields) {
			let fks = [];
			let pks = [];
			for (let field of fields) {
				let fk = __foreignKeys.find(fk => field.columnFullName == fk.column.columnFullName);
				let pk = __primaryKeys.find(pk => field.columnFullName == pk.column.columnFullName);
				if (fk) fks.push({
					column: new QueryColumn(null, alias, field.alias ? field.alias : field.columnName),
					tableName: fk.tableName,
					ambiguous: fk.ambiguous,
				});
				if (pk) pks.push({
					column: new QueryColumn(null, alias, field.alias ? field.alias : field.columnName),
					tableName: pk.tableName,
					ambiguous: pk.ambiguous,
				});
			}
			__foreignKeys = fks;
			__primaryKeys = pks;
		}
		return [__foreignKeys, __primaryKeys];
	}
	protected get __foreignKeys(): ForeignKey[] {
		return this.foreignKeys;
	}
	protected get __primaryKeys(): JoinablePrimaryKey[] {
		return this.primaryKeys;
	}
	protected get __sqlFrom(): string {
		return this.sql;
	}
}

export class Select {
	private __sql: string;
	private static aliasUid = 0;
	public constructor(private selectParams: SelectParams) {
		this.__sql = this.computeSql(selectParams);
	}
	private computeSql(selectParams: SelectParams): string {
		let fields: string = selectParams.fields ? selectParams.fields.map(a => a.aliasedColumn).join(",") : "*";
		let {
			from,
			limitOffset,
			limitSize,
			where,
			groupBy,
			having,
			orderBy,
		} = selectParams;
		if (!limitSize && selectParams.pageIndex) {
			limitOffset = PAGE_SIZE * selectParams.pageIndex;
			limitSize = PAGE_SIZE;
		}
	
		where = where ? "WHERE " + where : "";
		groupBy = groupBy ? "GROUP BY " + groupBy : "";
		having = having ? "HAVING " + having : "";
		let orderByStr = "";
		if (orderBy) {
			if (Array.isArray(orderBy)) {
				orderByStr = "ORDER BY " + orderBy.map((a) => a.columnFullName).join(",");
			} else {
				orderByStr = "ORDER BY " + orderBy.columnFullName;
			}
		}
	
		let limit = limitSize ? `LIMIT ${limitOffset ? limitOffset + "," : ""}${limitSize}` : "";
		let sql = `SELECT ${fields} FROM ${(<any>from).__sqlFrom} ${where} ${groupBy} ${having} ${orderByStr} ${limit}`;
		
		return sql.replace(/\s+/gm, " ").replace(/\s*\(\s*/gm, " (").replace(/\s*\)\s*/gm, ") ");
	}
	public get sql(): string {
		return this.__sql;
	}
	public asJoinable(alias?: string): JoinableSelectWithFileds {
		if (!alias) alias = "JoinableSelect" + Select.aliasUid++;
		return this.createJoinableProxy(alias, new JoinableSelect("(" + this.__sql + ") AS " + alias, alias, this.selectParams));
	}
	private createJoinableProxy(alias: string, joinableSelect: JoinableSelect): any {
		return new Proxy(joinableSelect, {
			get: (target: any, key) => {
				let k = key.toString();
				if (k.startsWith("__") || k == "innerJoin" || k == "leftJoin" || k == "rightJoin" || k == "naturalJoin") {
					return target[key];
				} else {
					return new QueryColumn(null, alias, k);
				}
			},
		});
	}
}