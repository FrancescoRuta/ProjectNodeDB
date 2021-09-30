import { connectionPool, select } from "./mysql";
import { Persone, Comuni } from "./example";

//TODO: Deprecate this
async function main() {
	let persone = new Persone();
	let comuni = new Comuni();
	let provincia = new Comuni("provincia");

	logQueryResult(
		await select({
			from: persone.innerJoin(comuni),
			limitSize: 5,
		})
	);

	logQueryResult(
		await select({
			from: persone
				.innerJoin(comuni)
				.innerJoin(provincia, [comuni.provincia, provincia.id]),
			fields: [
				persone.id.as("idPersona"),
				comuni.id.as("idComune"),
				persone.nome,
				comuni.comune,
				provincia.comune.as("provincia"),
			],
			orderBy: [comuni.id, persone.id],
			limitSize: 10,
		})
	);

	connectionPool.end();
}

function logQueryResult(a: any) {
	console.table(JSON.parse(JSON.stringify(a)));
}

main();
