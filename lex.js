const lexems = {
  // keyword: /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)/,
  literal: /^[a-z]\w*/,
  number: /^\d+(\.\d+)?/,
  space: /^\s+/,
  line: ';',
  assign: '=',
  or: '|',
  plus: '+',
  repeat: '[',
  endrepeat: ']',
  brace: '(',
  endbrace: ')',
  bracket: '{',
  endbracket: '}',
  string: {
    pattern: /^("([^"](\\")?)*"|'([^'](\\')?)*')/,
    parse(string) {
      return JSON.parse(string)
    }
  }
};

stackTokens = ['repeat', 'brace', 'bracket'];
binary = ['or', 'plus', 'assign', 'line'];

function scan(string, ownLexems = lexems) {
  if (0 === string.length) {
    return [];
  }
  for (const [name, entry] of Object.entries(ownLexems)) {
    if ('string' === typeof entry) {
      if (string.indexOf(entry) === 0) {
        return [[name], ...scan(string.slice(entry.length))]
      }
      continue;
    }
    const m = (entry.pattern || entry).exec(string);
    if (m) {
      return [
        [name, entry.parse ? entry.parse(m[0]) : m[0]],
        ...scan(string.slice(m[0].length))
      ]
    }
  }
  const result = scan(string.slice(1));
  if ('unknown' === result[0][0]) {
    result[0][1] = string[0] + result[0][1];
    return result
  }
  return [
    ['unknown', string[0]],
    ...result
  ];
}

function ignore(tokens, list = ['unknown', 'space']) {
  return tokens.filter(t => list.indexOf(t[0]) < 0)
}

module.exports = {scan, ignore};
