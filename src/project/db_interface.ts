import { IDbEngine } from "./db_engine";
import { PreparedSelect, PreparedSelectPaged, Select, SelectParams } from "./select";

export interface DbInterfaceConfig {
	dbEngine: IDbEngine;
	getLimitByPageIndex: (pageIndex: number) => [number, number];
}

export class DbInterface {
	
	public constructor(private config: DbInterfaceConfig) {}
	
	public prepareSelect(selectParams: SelectParams): PreparedSelect {
		return new Select(selectParams).prepare(this.config);
	}
	
	public prepareSelectPaged(selectParams: SelectParams): PreparedSelectPaged {
		return new Select(selectParams).preparePaged(this.config);
	}
	
}
