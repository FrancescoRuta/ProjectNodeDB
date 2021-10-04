import { startServer } from "./example/api";
import "./example/apis/articoli";

startServer();




/*

function getArray<N extends string, T, C extends Array<Col<N, T>>>(cons: [...C]): {
	[K in keyof C]: C[K] extends Col<N, T> ? C[K] : never
};
function getArray<N extends string, T>(cons: Col<N, T>[]): any[]  {
	return <any>{};
}

*/








/*
class Col<N extends string, T extends {}> {
	public constructor(name: N, value: T){}
}

type OptionalPropertyNames<T> = { [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> = { [P in K]: L[P] | Exclude<R[P], undefined> };

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<
  & Pick<L, Exclude<keyof L, keyof R>>
  & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
  & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
  & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ? SpreadTwo<L, Spread<R>> : unknown

type Foo = Spread<[{ a: string }, { a?: number }]>

function merge<A extends object[]>(...a: [...A]) {
  return Object.assign({}, ...a) as Spread<A>;
}
//let arr = [new Col("prova", true), new Col("provaStr", "ciao")];

function get<N extends string, T, A extends Col<N, T>[]>(i: [...A]) {
	return <any>{} as MySpread<A>;
}

let k = get([new Col("prova", true), new Col("provaStr", "ciao")]);


type MySpreadTwo<N extends string, T, R> = Id<
	{[J in N]: T} & R
>;
type MySpread<A extends readonly [...any]> = A extends [infer L, ...infer R] ? (L extends Col<> MySpreadTwo<L, MySpread<R>>) : unknown;*/