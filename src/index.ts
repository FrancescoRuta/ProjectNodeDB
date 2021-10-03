import { startServer } from "./example/api";
import "./example/apis/articoli";

startServer();






/*

class Col<N extends string, T extends {}> {
	public constructor(name: N, value: T){}
}

//let arr = [new Col("prova", true), new Col("provaStr", "ciao")];



let k = get({
	fields: [
		new Col("prova", true),
		new Col("provaStr", "ciao"),
		"ciao",
		"a",
		"tutti",
		new Col("provaNmbr", 5),
	]
});

type ObjKeyMap<T> = T extends infer U ? { [K in keyof U]: U[K] } : never
type ConcatTypes<N extends string, T, R> = ObjKeyMap<{[J in N]: T} & R>;
type ColTypeRecursion<A extends readonly [...any]> = A extends [infer L, ...infer R] ? (
		L extends Col<infer N, infer T> ? ConcatTypes<N, T, ColTypeRecursion<R>> : ColTypeRecursion<R>
	) : unknown;

interface Params<N extends string, T, A extends (Col<N, T> | string)[]> {
	fields: [...A];
}

function get<N extends string, T, A extends (Col<N, T> | string)[]>(params: Params<N, T, A>) {
	return <any>{} as ColTypeRecursion<A>;
}*/