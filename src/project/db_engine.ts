export interface IDbEngine<D> {
	executeSelect(sql: string, params: any[], dbEngineArgs: D | undefined): Promise<any[]>;
	execute(sql: string, params: any[], dbEngineArgs: D | undefined): Promise<any>;
	escapeDbIdentifier(ident: string): string;
}