class XRegExp {
  constructor(source, flag, root = "root") {
    this.table = new Map();
    this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag);
  }

  compileRegExp(source, name, start) {
    let length = 0;
    const regExp = source[name].source.replace(/\<([^>]+)\>/g, (str, $1) => {
      this.table.set(start + length, $1);
      // this.table.set($1, start + length);

      ++length;

      let r = this.compileRegExp(source, $1, start + length);
      length += r.length;
      return `(${r.source})`;
    });
    return { source: regExp, length };
  }

  exec(string) {
    const r = this.regexp.exec(string);
    for (let i = 1; i < r.length; i++) {
      if (r[i] !== void 0) {
        r[this.table.get(i - 1)] = r[i];
      }
    }

    return r;
  }

  get lastIndex() {
    return this.regexp.lastIndex;
  }

  set lastIndex(value) {
    this.regexp.lastIndex = lastIndex;
  }

  get source() {
    return this.regexp.source;
  }
}

export function* scan(str) {
  const regExp = new XRegExp(
    {
      InputElement: /<WhiteSpace>|<LineTerminator>|<Comments>|<Token>/,
      WhiteSpace: / /,
      LineTerminator: /\n|\r/,
      Comments: /<SingleLineComment>|<MultiLineComment>/,
      SingleLineComment: /\/\/.*<LineTerminator>/,
      MultiLineComment: /\/\*(?:[^*]|\*[^\/])*\*\//,
      Token: /<Literal>|<Keywords>|<Identifier>|<Punctuator>/,
      Literal: /<NumberLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>/,
      Keywords: /if|else|for|function|var|let|const|get|set/,
      Identifier: /[$_a-zA-Z][0-9a-zA-Z$_]*/,
      Punctuator:
        /<BracketsPunctuator>|\+|\-|\*|\/|\+\+|\-\-|\+=|\-=|\.|,|;|\:|=|==|===|!|!=|!==|@|&&|&|\|\||\||\]|\[|=>|\?|\>|\</,
      BracketsPunctuator: /\)|\(|\}|\{/,
      NumberLiteral: /(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
      BooleanLiteral: /true|false/,
      StringLiteral:
        /'(?:[^'\n]|\\[\s\S])*'|"(?:[^'\n]|\\[\s\S])*"|`(?:[^'\n]|\\[\s\S])*`/,
      NullLiteral: /null/,
    },
    "g",
    "InputElement"
  );
  // console.log(regExp.source);
  while (regExp.lastIndex < str.length) {
    const r = regExp.exec(str);

    if (r.WhiteSpace) {
      //
    } else if (r.Comments) {
      //
    } else if (r.LineTerminator) {
      //
    } else if (r.NumberLiteral) {
      yield {
        type: "NumberLiteral",
        value: r[0],
      };
    } else if (r.BooleanLiteral) {
      yield {
        type: "BooleanLiteral",
        value: r[0],
      };
    } else if (r.StringLiteral) {
      yield {
        type: "StringLiteral",
        value: r[0],
      };
    } else if (r.NullLiteral) {
      yield {
        type: "NullLiteral",
        value: null,
      };
    } else if (r.Identifier) {
      yield {
        type: "Identifier",
        value: r[0],
      };
    } else if (r.Keywords) {
      yield {
        type: r[0],
      };
    } else if (r.Punctuator) {
      yield {
        type: r[0],
      };
    } else {
      throw new Error(`unexpected token ${r[0]}`);
    }

    if (!r[0].length) {
      break;
    }
  }

  yield {
    type: "EOF",
  };
}
