import { createPool } from "mysql2/promise";
import { IDbEngine } from "../project/db_engine";
import { DbInterface } from "../project/db_interface";
import { exposeDbApi } from "./api";

class DbEngine implements IDbEngine {
	async execute(sql: string, params: any[]): Promise<any> {
		console.log(sql, params);
		await connectionPool.execute(sql, params);
	}
	async executeSelect(sql: string, params: any[]): Promise<any[]> {
		console.log(sql, params);
		let result = await connectionPool.execute(sql, params);
		return <any>result[0];
	}
}

const PAGE_SIZE = 50;

export let db = new DbInterface({
	dbEngine: new DbEngine(),
	pageIndexParam: "pageIndex",
	getLimitByPageIndex: index => [index * PAGE_SIZE, PAGE_SIZE],
	expose: exposeDbApi,
});

let connectionPool = createPool({
	host: 'localhost',
	user: 'application',
	database: 'chimiclean',
});