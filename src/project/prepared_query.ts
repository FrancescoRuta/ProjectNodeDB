import { IDbEngine } from "./db_engine";

export abstract class PreparedQuery {
	
	public constructor() {}
	
	public abstract run(params?: any): Promise<any>;
	
}