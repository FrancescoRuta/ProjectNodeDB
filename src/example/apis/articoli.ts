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

let query1 = db.prepareSelect({
	from: articoli.innerJoin(unitaDiMisura),
	fields: [
		articoli.id,
		articoli.codice,
		unitaDiMisura.descrizione.as("unitaDiMisura")
	]
});

async function api() {
	let rows = await query1.run();
	for (let row of rows) {
		console.log(row);
	}
}

api();