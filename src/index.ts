import { Persone, Comuni } from "./example";
import { Select } from "./select";
import { sqlCalc } from "./sqlCalc";

async function main() {
	let persone = new Persone();
	let comuni = new Comuni();
	let provincia = new Comuni("provincia");

	let select0 = new Select({
		from: persone,
		fields: [
			persone.id,
			persone.nome,
			persone.comune.as("residenza"),
		],
		limitSize: 5,
	}).asJoinable("prova");
	
	let select1 = new Select({
		from: select0
			.innerJoin(comuni)
			.innerJoin(provincia, [comuni.provincia, provincia.id]),
		fields: [
			select0.id.as("idPersona"),
			comuni.id.as("idComune"),
			select0.nome,
			comuni.comune,
			provincia.comune.as("provincia"),
		],
		orderBy: [comuni.id, select0.id],
		limitSize: 10,
	});
	
	console.log(select1.sql);
	
}

function test() {
	let persone = new Persone();
	let residenza = new Comuni();
	
	sqlCalc("(:id*2)+1", {id: persone.id});
	sqlCalc("(?*2)+1", [persone.id]);
	sqlCalc("(?*2*?)+1", persone.id);
	sqlCalc("(?*2)+1", persone.id, persone.id);
	
	let nextPersona = new Select({
		from: persone,
		fields: [
			persone.comune,
		]
	}).asJoinable();
	
	let select = new Select({
		from: nextPersona.innerJoin(residenza)
	});
	
	console.log(select.sql);
}

function logQueryResult(a: any) {
	console.table(JSON.parse(JSON.stringify(a)));
}

test();