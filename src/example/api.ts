import { PreparedQuery } from "../project/prepared_query";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser());

export type ExposeOptions = string | {
	path: string,
	method: "GET" | "POST",
};

export function exposeDbApi(opts: ExposeOptions, preparedQuery: PreparedQuery): void {
	if (typeof opts == "string") {
		opts = {
			path: opts,
			method: "POST",
		}
	}
	
	console.log(opts);
	
	switch (opts.method) {
		case "GET":
			app.get(opts.path, async (req, res) => {
				res.send(await preparedQuery.run());
			});
			break;
		case "POST":
			app.post(opts.path, async (req, res) => {
				res.send(await preparedQuery.run(req.body));
			});
			break;
	}
	
}

export function startServer(): void {
	app.listen(port, () => {
		console.log(`Example app listening at http://172.27.97.198:${port}`);
	});
}
