import { PreparedQuery } from "../project/prepared_query";
import express from "express";
import bodyParser from "body-parser";
import { QueryType } from "../project/db_interface";

const app = express();
const port = 3000;

app.use(bodyParser());

export type AllowedMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ExposeOptions = string | {
	path: string,
	method: AllowedMethod,
};

export function exposeDbApi(opts: ExposeOptions, queryType: QueryType, preparedQuery: PreparedQuery): void {
	if (typeof opts == "string") {
		let method: AllowedMethod;
		switch (queryType) {
			case "DELETE": method = "DELETE"; break;
			case "INSERT": method = "POST"; break;
			case "SELECT": method = "GET"; break;
			case "SELECT_PAGED": method = "GET"; break;
			case "UPDATE": method = "PATCH"; break;
		}
		opts = {
			path: opts,
			method,
		}
	}
	
	console.log(opts);
	
	switch (opts.method) {
		case "GET":
			app.get(opts.path, async (req, res) => res.send(await preparedQuery.run(req.query)))
		break;
		case "DELETE":
			app.delete(opts.path, async (req, res) => res.send(await preparedQuery.run(req.query)))
		break;
		case "POST":
			app.post(opts.path, async (req, res) => res.send(await preparedQuery.run(req.body)))
		break;
		case "PUT":
			app.put(opts.path, async (req, res) => res.send(await preparedQuery.run(req.body)))
		break;
		case "PATCH":
			app.patch(opts.path, async (req, res) => res.send(await preparedQuery.run(req.body)))
		break;
	}
	
}

export function startServer(): void {
	app.listen(port, () => {
		console.log(`Example app listening at http://172.27.97.198:${port}`);
	});
}
