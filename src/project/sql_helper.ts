import { BindableEnity } from "./entities";

export function getPositionalQuery(sql: string): [string, string[]] {
	let tokens = tokenizeSqlString(sql);
	let positionalQuery: string = "";
	let paramNames: string[] = [];
	for (let token of tokens) {
		let value = token.value;
		if (token.ty == "NAMED_PLACEHOLDER") {
			paramNames.push(value.substring(1, value.length - 1));
			positionalQuery += "?";
		} else {
			positionalQuery += value;
		}
	}
	return [positionalQuery, paramNames];
}

export function tokenizeSqlString(sql: string): Token[] {
	return findTokens(sql, [
		{
			ty: "STRING_LITERAL",
			regex: /^(["'])(?:(?=(\\?))\2.)*?\1/g,
		}, {
			ty: "NAMED_PLACEHOLDER",
			regex: /^:[a-zA-Z\_\-0-9]+\:/g,
		}, {
			ty: "COLUMN_PLACEHOLDER",
			regex: /^@[a-zA-Z\_\.\-0-9]+/g,
		}, {
			ty: "ANONYMOUS_PLACEHOLDER",
			regex: /^\?/g,
		}
	]);
}

export function replaceColumnPlaceholders(sql: string, entityParams: any) {
	let tokens = tokenizeSqlString(sql);
	sql = "";
	for(let token of tokens){
		if(token.ty == "COLUMN_PLACEHOLDER"){
			let objectPathStr = token.value.substring(1);
			let objectPath = objectPathStr.split(".");
			let value = entityParams;
			let prevValue, lastPathPart: string;
			for(let i = 0; i < objectPath.length; ++i) {
				if(!value) throw new Error(`Entity "${objectPathStr}" not found.`);
				prevValue = value;
				lastPathPart = objectPath[i];
				value = value[lastPathPart];
			}
			if (!value) {
				let bindableEnities = findAllBindableEnities(prevValue);
				let bindableEnity = bindableEnities[lastPathPart!];
				if (!bindableEnity) throw new Error(`Entity "${objectPathStr}" not found.`);
				if (bindableEnity.ambiguous) throw new Error(`Entity "${objectPathStr}" is ambiguous, use full entity path.`);
				sql += (<any>bindableEnity.entity).__enityBinding;
			} else {
				if(!(value instanceof BindableEnity)) throw new Error(`"${objectPathStr}" is not a parametrizable entity.`);
				sql += (<any>value).__enityBinding;
			}
			
		}else{
			sql += token.value;
		}
	}
	return sql;
}

function findAllBindableEnities(value: any, name?: string): {[name: string]: {entity: BindableEnity, ambiguous: boolean}} {
	if (value instanceof BindableEnity) {
		let object: any = {};
		object[name!] = {entity: value, ambiguous: false};
		return object;
	}
	let bindableEnities: {[name: string]: {entity: BindableEnity, ambiguous: boolean}} = {};
	let keys: string[];
	if (isPlainObject(value)) {
		keys = Object.keys(value);
	} else {
		keys = Object.getOwnPropertyNames(Object.getPrototypeOf(value)).filter(k => !k.startsWith("__") && k != "constructor");
	}
	for (let key of keys) {
		let subBindableEnities = findAllBindableEnities(value[key], key);
		for (let name in subBindableEnities) {
			if (bindableEnities[name]) {
				bindableEnities[name].ambiguous = true;
			} else {
				bindableEnities[name] = subBindableEnities[name];
			}
		}
	}
	return bindableEnities;
}

function isPlainObject(obj: any): boolean {
	const prototype = Object.getPrototypeOf(obj);
	return  prototype === Object.getPrototypeOf({}) || prototype === null;
}

type TokenType = "STRING_LITERAL" | "NAMED_PLACEHOLDER" | "COLUMN_PLACEHOLDER" | "ANONYMOUS_PLACEHOLDER" | "OTHER";

interface TokenRule {
	ty: TokenType;
	regex: RegExp;
}

interface Token {
	ty: TokenType;
	value: string;
}

function findTokens(sql: string, tokenRules: TokenRule[]): Token[] {
	let tokens: Token[] = [];
	let currentToken = "";
	while (sql.length > 0) {
		let match = null;
		let tokenRule!: TokenRule;
		for (let tr of tokenRules) {
			tr.regex.lastIndex = 0;
			if ((match = tr.regex.exec(sql)) != null) {
				if (match.index === 0) {
					tokenRule = tr;
					break;
				} else {
					match = null;
				}
			}
		}
		if (match == null) {
			currentToken += sql[0];
			sql = sql.substring(1);
		} else {
			tokens.push({
				ty: "OTHER",
				value: currentToken,
			});
			currentToken = "";
			let lastIndex = tokenRule.regex.lastIndex;
			tokens.push({
				ty: tokenRule.ty,
				value: sql.substring(0, lastIndex),
			});
			sql = sql.substring(lastIndex);
		}
	}
	tokens.push({
		ty: "OTHER",
		value: currentToken,
	});
	return tokens.filter(t => t.ty != "OTHER" || t.value.length > 0);
}