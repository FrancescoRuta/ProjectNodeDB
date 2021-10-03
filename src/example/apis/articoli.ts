import { db } from "../db";
import { Articoli, ArticoliClassificazione, UnitaDiMisura } from "../ent";

let articoli = new Articoli();
let unitaDiMisura = new UnitaDiMisura();
let classificazione = new ArticoliClassificazione();

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

let k = db.select({
	from: articoli.innerJoin(unitaDiMisura).innerJoin(classificazione),
	fields: [
		articoli.id,
		articoli.classificazione,
		articoli.codice.as("cacca")
	]
});
let joinable = k.asJoinable();
let id = joinable.id;
let c = joinable.classificazione;
let kw = joinable.cacca;
let kikki = db.prepareSelect({
	from: articoli.innerJoin(unitaDiMisura).innerJoin(classificazione),
	fields: [
		articoli.id,
		articoli.classificazione,
		articoli.codice.as("cacca")
	]
});
async function prova() {
	let ciao = await kikki.run();
	for (let {id} of ciao) {
		console.log(id)
	}
}