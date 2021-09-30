import { Comuni, Persone } from "./example";
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

let persone = new Persone();
let residenza = new Comuni();

let preparedSelect = dbInterface.prepareSelectPaged({
	from: persone.innerJoin(residenza),
	fields: [
		persone.nome,
		persone.cognome,
		residenza.comune,
	],
	where: "persone.nome like :nome:"
});

preparedSelect.run({
	params: {
		nome: "Sam"
	},
	pageIndex: 0,
});
preparedSelect.run({
	params: {
		nome: "Bill"
	},
	pageIndex: 1,
});