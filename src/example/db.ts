import { createPool } from "mysql2/promise";
import { IDbEngine } from "../project/db_engine";
import { DbInterface, ExecuteBefore } from "../project/db_interface";
import { exposeDbApi } from "./api";

class DbEngine implements IDbEngine<void> {
	async execute(sql: string, params: any[], _dbEngineArgs: void | undefined): Promise<any> {
		try {
			console.log(sql, params);
			await connectionPool.execute(sql, params);
		} catch(error) {
			console.error(error);
		}
	}
	async executeSelect(sql: string, params: any[], _dbEngineArgs: void | undefined): Promise<any[]> {
		try {
			console.log(sql, params);
			let result = await connectionPool.execute(sql, params);
			return <any>result[0];
		} catch(error) {
			console.error(error);
			return [];
		}
	}
}

const PAGE_SIZE = 50;

export let db = new DbInterface({
	dbEngine: new DbEngine(),
	pageIndexParam: "pageIndex",
	getLimitByPageIndex: index => [index * PAGE_SIZE, PAGE_SIZE],
	expose: exposeDbApi,
	executeBefore: escapeParams
});

export function escapeParams<T>(then?: ExecuteBefore<T>): ExecuteBefore<T> {
	return (args) => {
		console.log(args);
		if (args.queryType == "SELECT" || args.queryType == "SELECT_PAGED") args.paramNames.forEach(p => args.params[p] = escapeParam(args.params[p]));
		if (then) return then(args);
	};
}

function escapeParam(p: any): any {
	if (typeof p == "string")
		p = p
			.replace(/\\/gm, "\\\\")
			.replace(/\_/gm, "\\_")
			.replace(/\%/gm, "\\%");
	return p;
}

let connectionPool = createPool({
	host: 'localhost',
	user: 'application',
	database: 'chimiclean',
});