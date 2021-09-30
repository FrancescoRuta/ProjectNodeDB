export interface IDbEngine {
	executeSelect(sql: string, params: any[]): Promise<any[]>;
	execute(sql: string, params: any[]): Promise<any>;
}