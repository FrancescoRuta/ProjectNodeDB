import { db } from "../db";
import { Articoli, ArticoliClassificazione, UnitaDiMisura } from "../ent";

let articoli = new Articoli();
let unitaDiMisura = new UnitaDiMisura();
let classificazione = new ArticoliClassificazione();
/*
db.exposeSelectPaged("/articoli/get", {
	from: articoli.innerJoin(unitaDiMisura).innerJoin(classificazione),
	fields: [
		articoli.id,
		articoli.codice,
		articoli.descrizione,
		unitaDiMisura.simbolo.as("unitaDiMisura"),
		classificazione.value.as("classificazione"),
	],
	where: "@codice like :codice:",
});

db.exposeInsert("/articoli/add", articoli);
*/

let query0 = db.select({
	from: articoli.innerJoin(unitaDiMisura),
	fields: [
		articoli.id,
		articoli.codice,
		unitaDiMisura.descrizione.as("unitaDiMisura"),
		articoli.classificazione,
	]
}).asJoinable();

let query1 = db.prepareSelect({
	from: query0.innerJoin(classificazione),
	fields: [
		query0.id,
		query0.codice,
		query0.unitaDiMisura,
		classificazione.value.as("classificazione"),
	]
});

async function api() {
	let rows = await query1.run();
	for (let row of rows) {
		console.log(row);
	}
}

api();