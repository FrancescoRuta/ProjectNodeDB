import { Comuni, Persone, ChkinIngressi, MngUtenti } from "./example";
import { IDbEngine } from "./project/db_engine";
import { DbInterface } from "./project/db_interface"

class DbEngine implements IDbEngine {
	async executeSelect(sql: string, params: any[]): Promise<any[]> {
		console.log(sql, params);
		return [];
	}
}

const PAGE_SIZE = 50;
let dbInterface = new DbInterface({
	dbEngine: new DbEngine(),
	getLimitByPageIndex: index => [index * PAGE_SIZE, PAGE_SIZE],
});

/*
SELECT
	utenti.username,
	SUM(TIMESTAMPDIFF(SECOND, entrata, uscita))
FROM
	chkin_ingressi ingressi
	INNER JOIN mng_utenti utenti
	ON utenti.id = ingressi.id_utente
GROUP BY 
	DATE(entrata),
	utenti.id 
ORDER BY
	utenti.id;
*/

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



/*
preparedSelect.run({
	params: {
		nome: "Sam"
	},
	pageIndex: 0,
});*/
preparedSelect.run({
	params: {
		nome: "Bill"
	},
	pageIndex: 1,
});