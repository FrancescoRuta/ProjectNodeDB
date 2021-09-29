import { connectionPool, select } from "./mysql";
import { Persone, Comuni } from "./example";

async function main() {
	let persone = new Persone();
	let comuni = new Comuni();
	let p = new Persone("p");
	let c = new Comuni("c");

	await select({
		from: persone
	});

	await select({
		from: p
	});

	console.log(await select({
		from: p.innerJoin(comuni).innerJoin(c, [comuni.provincia, c.id]), 
		fields: [
			comuni.id.as("idComune"), p.id.as("idPersona"),
			c.comune.as("provincia"),
		],
		orderBy: [comuni.id, p.id],
		limitSize: 10
	}));


	connectionPool.end();
}

main();
