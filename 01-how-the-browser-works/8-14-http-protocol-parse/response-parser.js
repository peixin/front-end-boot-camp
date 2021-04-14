const ChunkedBodyParser = require("./chunked-body-parser");

module.exports = class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;

    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;

    this.WAITING_BODY = 7;

    this.currentState = this.WAITING_STATUS_LINE;
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
    console.log(this.statusLine);
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
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar(char) {
    if (this.currentState === this.WAITING_STATUS_LINE) {
      if (char === "\r") {
        this.currentState = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.currentState === this.WAITING_STATUS_LINE_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_HEADER_NAME;
      }
    } else if (this.currentState === this.WAITING_HEADER_NAME) {
      if (char === ":") {
        this.currentState = this.WAITING_HEADER_SPACE;
      } else if (char === "\r") {
        this.currentState = this.WAITING_HEADER_BLOCK_END;
      } else {
        this.headerName += char;
      }
    } else if (this.currentState === this.WAITING_HEADER_SPACE) {
      if (char === " ") {
        this.currentState = this.WAITING_HEADER_VALUE;
      }
    } else if (this.currentState === this.WAITING_HEADER_VALUE) {
      if (char === "\r") {
        this.currentState = this.WAITING_HEADER_LINE_END;
      } else {
        this.headerValue += char;
      }
    } else if (this.currentState === this.WAITING_HEADER_LINE_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_HEADER_NAME;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      }
    } else if (this.currentState === this.WAITING_HEADER_BLOCK_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_BODY;
        if (this.headers["Transfer-Encoding"] === "chunked") {
          this.bodyParser = new ChunkedBodyParser();
        }
      }
    } else if (this.currentState === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
};
