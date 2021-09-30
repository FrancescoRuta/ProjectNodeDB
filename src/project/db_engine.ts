export interface IDbEngine {
	executeSelect(sql: string, params: any[]): Promise<any[]>;
}