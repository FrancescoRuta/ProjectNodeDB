import { createPool } from "mysql2/promise";
import * as config from "./config";
import { QueryColumn, SqlFrom } from "./entities";

export const connectionPool = createPool({
	host: "localhost",
	user: "prove",
	password: "provePass",
	database: "prove",
	namedPlaceholders: true,
});

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
	params?: any;
}

export async function query(sql: string, params?: any): Promise<any[]> {
	let connection = await connectionPool.getConnection();
	let result = await connection.execute(sql, params);
	connection.release();
	return <any>result[0];
}

export async function select(selectParams: SelectParams): Promise<any[]> {
	let fields: string = selectParams.fields
		? selectParams.fields.map((a) => a.aliasedColumn).join(",")
		: "*";

	let {
		from,
		limitOffset,
		limitSize,
		where,
		groupBy,
		having,
		orderBy,
		params,
	} = selectParams;
	if (!limitSize && selectParams.pageIndex) {
		limitOffset = config.PAGE_SIZE * selectParams.pageIndex;
		limitSize = config.PAGE_SIZE;
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

	let limit = limitSize
		? `LIMIT ${limitOffset ? limitOffset + "," : ""}${limitSize}`
		: "";
	let sql = `SELECT ${fields} FROM ${
		(<any>from).__sqlFrom
	} ${where} ${groupBy} ${having} ${orderByStr} ${limit}`;
	console.log(sql);
	return query(sql, params);
}
