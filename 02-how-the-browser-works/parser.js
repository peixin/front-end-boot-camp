const EOF = Symbol("EOF");

let currentToken = null;
let currentAttribute = null;

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
  if (c.match(/^[\t\n\f ]$/)) {
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

// <html lang="en"></html>
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === ">") {
    return tagName(c);
  } else if (c === "/") {
    return selfClosingStartTag;
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[a-zA-Z0-9\-]$/)) {
    currentAttribute.name += c;
    return attributeName;
  } else {
    return afterAttributeName(c);
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = "";
    return tagName(c);
  } else if (c === "/") {
    currentToken[currentAttribute.name] = "";
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else {
    return afterAttributeName;
  }
}

function beforeAttributeValue(c) {
  if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    return tagName(c);
  } else {
    return unquotedAttributeValue(c);
  }
}

function afterQuotedAttributeValue(c) {
  if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    return tagName(c);
  }  else {
    return beforeAttributeName(c);
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function unquotedAttributeValue(c) {
  if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return tagName(c);
  } else if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName(c);
  } else {
    currentAttribute.value += c;
    return unquotedAttributeValue;
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
