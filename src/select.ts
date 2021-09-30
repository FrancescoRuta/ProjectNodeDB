import { PAGE_SIZE } from "./config";
import { ForeignKey, Joinable, JoinablePrimaryKey, QueryColumn, SqlFrom } from "./entities";

export type JoinableSelectWithFileds = Joinable & {
	[col: string]: QueryColumn
};

export interface SelectParams {
	from: SqlFrom;
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
	public constructor(
		private __sql: string,
		private alias: string,
	) {
		super();
	}
	protected get __foreignKeys(): ForeignKey[] {
		return [];
	}
	protected get __primaryKeys(): JoinablePrimaryKey[] {
		return [];
	}
	protected get __sqlFrom(): string {
		return this.__sql;
	}
	public getColumn(col: string): QueryColumn {
		return new QueryColumn(this.alias + "." + col);
	}
}

export class Select {
	private __sql: string;
	public constructor(selectParams: SelectParams) {
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
				orderByStr = "ORDER BY " + orderBy.map((a) => a.column).join(",");
			} else {
				orderByStr = "ORDER BY " + orderBy.column;
			}
		}
	
		let limit = limitSize ? `LIMIT ${limitOffset ? limitOffset + "," : ""}${limitSize}` : "";
		let sql = `SELECT ${fields} FROM ${(<any>from).__sqlFrom} ${where} ${groupBy} ${having} ${orderByStr} ${limit}`;
		
		return sql.replace(/\s/gm, " ");
	}
	public get sql(): string {
		return this.__sql;
	}
	public asJoinable(alias: string): JoinableSelectWithFileds {
		let j = new JoinableSelect("(" + this.__sql + ") AS " + alias, alias);
		const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T => k in obj;
		let p = new Proxy(j, {
			get: (target, key) => {
				if (hasKey(target, key)) {
					return target[key];
				} else {
					return new QueryColumn(alias + "." + key.toString());
				}
			},
		});
		return <any>p;
	}
}