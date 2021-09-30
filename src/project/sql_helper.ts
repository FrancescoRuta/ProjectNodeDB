
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