const EOF = Symbol("EOF");

let currentToken = null;

function emit(token) {
  console.log(token);
}

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: "EOF" });
    return;
  } else {
    emit({ type: "text", content: c });
    return data;
  }
}

function tagOpen(c) {
  // </div>
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z0-9\-]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    return tagOpen;
  }
}

// </div>
function endTagOpen(c) {
  if (c === ">") {
    return data;
  } else if (c === EOF) {
    return data(c);
  } else if (c.match(/^[a-zA-Z0-9\-]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    return endTagOpen;
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f $]/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z0-9\-]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f $]/)) {
    return beforeAttributeName;
  } else if (c === ">") {
    return data;
  } else if (c === "=") {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else {
    return beforeAttributeName;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    return data(C);
  } else {
    return selfClosingStartTag;
  }
}

module.exports.parserHTML = function parserHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
};
