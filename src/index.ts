import { Comuni, Persone, ChkinIngressi, MngUtenti } from "./example";
import { IDbEngine } from "./project/db_engine";
import { DbInterface } from "./project/db_interface"
import { PreparedQuery } from "./project/prepared_query";
import express from "express";
import bodyParser from "body-parser";

class DbEngine implements IDbEngine {
	async execute(sql: string, params: any[]): Promise<any> {
		console.log("EXECUTE", sql, params);
	}
	async executeSelect(sql: string, params: any[]): Promise<any[]> {
		console.log("EXECUTE_SELECT", sql, params);
		return [{prova:"p1"}, {prova:"p2"}];
	}
}

const PAGE_SIZE = 50;
let dbInterface = new DbInterface({
	dbEngine: new DbEngine(),
	getLimitByPageIndex: index => [index * PAGE_SIZE, PAGE_SIZE],
	expose: exposeDbApi,
});

const app = express();
const port = 3000;
app.use(bodyParser.json({ type: 'application/*+json' }))

app.get('/', function(req, res){
	res.send("Hi");
});

function exposeDbApi(path: string, preparedQuery: PreparedQuery): void {
	console.log(path);
	app.get(path, async (req, res) => {
		res.send(await preparedQuery.run(req.body));
	})
}

let ingressi = new ChkinIngressi();
let utenti = new MngUtenti();

let preparedSelect = dbInterface.prepareSelect({
	from: ingressi.innerJoin(utenti),
	fields: [
		utenti.username,
		"SUM(TIMESTAMPDIFF(SECOND, @entrata, @uscita))"
	],
	groupBy: [
		utenti.id,
		"DATE(@entrata)"
	],
	orderBy: [
		utenti.id
	],
	entityParams: ingressi
});

let preparedInsert = dbInterface.prepareInsert({
	table: ingressi,
	fields: [
		ingressi.uscita,
		ingressi.entrata.as("ingresso"),
	]
});

let preparedUpdate = dbInterface.prepareUpdate({
	table: ingressi,
	fields: [
		ingressi.entrata.as("arrivo"),
	],
	where: "@id=:id:",
});

let preparedDelte = dbInterface.prepareDelete({
	table: ingressi,
	where: "@idUtente=:usr:",
});


dbInterface.exposeSelect("/getData", {
	from: ingressi.innerJoin(utenti),
	fields: [
		utenti.username,
		"SUM(TIMESTAMPDIFF(SECOND, @entrata, @uscita))"
	],
	groupBy: [
		utenti.id,
		"DATE(@entrata)"
	],
	orderBy: [
		utenti.id
	],
	entityParams: ingressi
});




app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})