import { GenericQueryColumn, Joinable, QueryColumn } from "../../project/entities";
import { db } from "../db";
import { Articoli, ArticoliClassificazione, UnitaDiMisura } from "../ent";

let articoli = Articoli.get();
let unitaDiMisura = UnitaDiMisura.get();
let unitaDiMisura0 = UnitaDiMisura.as("um0");
let unitaDiMisura1 = UnitaDiMisura.as("um1");
let unitaDiMisura2 = UnitaDiMisura.as("um2");
let unitaDiMisura3 = UnitaDiMisura.as("um3");
let unitaDiMisura4 = UnitaDiMisura.as("um4");
let unitaDiMisura5 = UnitaDiMisura.as("um5");
let unitaDiMisura6 = UnitaDiMisura.as("um6");
let unitaDiMisura7 = UnitaDiMisura.as("um7");
let unitaDiMisura8 = UnitaDiMisura.as("um8");
let unitaDiMisura9 = UnitaDiMisura.as("um9");
let unitaDiMisura10 = UnitaDiMisura.as("um10");
let unitaDiMisura11 = UnitaDiMisura.as("um11");
let unitaDiMisura12 = UnitaDiMisura.as("um12");
let unitaDiMisura13 = UnitaDiMisura.as("um13");
let unitaDiMisura14 = UnitaDiMisura.as("um14");
let unitaDiMisura15 = UnitaDiMisura.as("um15");
let classificazione = ArticoliClassificazione.get();

let join = articoli
	.InnerJoin(unitaDiMisura0)
	.InnerJoin(unitaDiMisura1)
	.InnerJoin(unitaDiMisura2)
	.InnerJoin(unitaDiMisura3)
	.InnerJoin(unitaDiMisura4)
	.InnerJoin(unitaDiMisura5)
	.InnerJoin(unitaDiMisura6)
	.InnerJoin(unitaDiMisura7)
	.InnerJoin(unitaDiMisura8)
	.InnerJoin(unitaDiMisura9)
	.InnerJoin(unitaDiMisura10)
	.InnerJoin(unitaDiMisura11)
	.InnerJoin(unitaDiMisura12)
	.InnerJoin(unitaDiMisura13)
	.InnerJoin(unitaDiMisura14)
	.InnerJoin(unitaDiMisura15);

let query0 = db.select({
	from: join,
	fields: [
		...articoli.All,
		unitaDiMisura0.id.as("idUnitaDiMisura0"),
		unitaDiMisura1.id.as("idUnitaDiMisura1"),
		unitaDiMisura2.id.as("idUnitaDiMisura2"),
		unitaDiMisura3.id.as("idUnitaDiMisura3"),
		unitaDiMisura4.id.as("idUnitaDiMisura4"),
		unitaDiMisura5.id.as("idUnitaDiMisura5"),
		unitaDiMisura6.id.as("idUnitaDiMisura6"),
		unitaDiMisura7.id.as("idUnitaDiMisura7"),
		unitaDiMisura8.id.as("idUnitaDiMisura8"),
		unitaDiMisura9.id.as("idUnitaDiMisura9"),
		unitaDiMisura10.id.as("idUnitaDiMisura10"),
		unitaDiMisura11.id.as("idUnitaDiMisura11"),
		unitaDiMisura12.id.as("idUnitaDiMisura12"),
		unitaDiMisura13.id.as("idUnitaDiMisura13"),
		unitaDiMisura14.id.as("idUnitaDiMisura14"),
		unitaDiMisura15.id.as("idUnitaDiMisura15"),
		unitaDiMisura0.descrizione.as("descrizioneUnitaDiMisura0"),
		unitaDiMisura1.descrizione.as("descrizioneUnitaDiMisura1"),
		unitaDiMisura2.descrizione.as("descrizioneUnitaDiMisura2"),
		unitaDiMisura3.descrizione.as("descrizioneUnitaDiMisura3"),
		unitaDiMisura4.descrizione.as("descrizioneUnitaDiMisura4"),
		unitaDiMisura5.descrizione.as("descrizioneUnitaDiMisura5"),
		unitaDiMisura6.descrizione.as("descrizioneUnitaDiMisura6"),
		unitaDiMisura7.descrizione.as("descrizioneUnitaDiMisura7"),
		unitaDiMisura8.descrizione.as("descrizioneUnitaDiMisura8"),
		unitaDiMisura9.descrizione.as("descrizioneUnitaDiMisura9"),
		unitaDiMisura10.descrizione.as("descrizioneUnitaDiMisura10"),
		unitaDiMisura11.descrizione.as("descrizioneUnitaDiMisura11"),
		unitaDiMisura12.descrizione.as("descrizioneUnitaDiMisura12"),
		unitaDiMisura13.descrizione.as("descrizioneUnitaDiMisura13"),
		unitaDiMisura14.descrizione.as("descrizioneUnitaDiMisura14"),
		unitaDiMisura15.descrizione.as("descrizioneUnitaDiMisura15"),
		unitaDiMisura0.simbolo.as("simboloUnitaDiMisura0"),
		unitaDiMisura1.simbolo.as("simboloUnitaDiMisura1"),
		unitaDiMisura2.simbolo.as("simboloUnitaDiMisura2"),
		unitaDiMisura3.simbolo.as("simboloUnitaDiMisura3"),
		unitaDiMisura4.simbolo.as("simboloUnitaDiMisura4"),
		unitaDiMisura5.simbolo.as("simboloUnitaDiMisura5"),
		unitaDiMisura6.simbolo.as("simboloUnitaDiMisura6"),
		unitaDiMisura7.simbolo.as("simboloUnitaDiMisura7"),
		unitaDiMisura8.simbolo.as("simboloUnitaDiMisura8"),
		unitaDiMisura9.simbolo.as("simboloUnitaDiMisura9"),
		unitaDiMisura10.simbolo.as("simboloUnitaDiMisura10"),
		unitaDiMisura11.simbolo.as("simboloUnitaDiMisura11"),
		unitaDiMisura12.simbolo.as("simboloUnitaDiMisura12"),
		unitaDiMisura13.simbolo.as("simboloUnitaDiMisura13"),
		unitaDiMisura14.simbolo.as("simboloUnitaDiMisura14"),
		unitaDiMisura15.simbolo.as("simboloUnitaDiMisura15"),
	]
});

let query1 = db.prepareSelectPaged({
	from: query0.InnerJoin(classificazione),
	fields: [
		...query0.All,
	]
});
async function api() {
	let rows = await query1.run({pageIndex:0});
	console.table(rows[0]);
}

api();