const ChunkedBodyParser = require("./chunked-body-parser");

module.exports = class ResponseParser {
  constructor() {
    this.currentState = this.waitingStatusLine;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";

    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/[\d.]+ (\d+) (\w+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }

  receive(string) {
    for (let i = 0; i < string.length; i += 1) {
      this.currentState = this.currentState(string.charAt(i));
    }
  }

  waitingStatusLine(char) {
    if (char === "\r") {
      return this.waitingStatusLineEnd;
    } else {
      this.statusLine += char;
    }
    return this.waitingStatusLine;
  }

  waitingStatusLineEnd(char) {
    if (char === "\n") {
      return this.waitingHeaderName;
    }
    return this.waitingStatusLineEnd;
  }

  waitingHeaderName(char) {
    if (char === ":") {
      return this.waitingHeaderSpace;
    } else if (char === "\r") {
      return this.waitingHeaderBlockEnd;
    } else {
      this.headerName += char;
    }
    return this.waitingHeaderName;
  }

  waitingHeaderSpace(char) {
    if (char === " ") {
      return this.waitingHeaderValue;
    }
    return this.waitingHeaderSpace;
  }

  waitingHeaderValue(char) {
    if (char === "\r") {
      return this.waitingHeaderLineEnd;
    } else {
      this.headerValue += char;
    }
    return this.waitingHeaderValue;
  }

  waitingHeaderLineEnd(char) {
    if (char === "\n") {
      this.headers[this.headerName] = this.headerValue;
      this.headerName = "";
      this.headerValue = "";
      return this.waitingHeaderName;
    }
    return this.waitingHeaderLineEnd;
  }

  waitingHeaderBlockEnd(char) {
    if (char === "\n") {
      if (this.headers["Transfer-Encoding"] === "chunked") {
        this.bodyParser = new ChunkedBodyParser();
      }
      return this.waitingBody;
    }
    return this.waitingHeaderBlockEnd;
  }

  waitingBody(char) {
    this.bodyParser.receiveChar(char);
    return this.waitingBody;
  }
};
