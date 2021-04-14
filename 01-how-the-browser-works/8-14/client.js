const net = require("net");

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || "80";
    this.path = options.path || "/";
    this.headers = options.headers || {};
    this.body = options.body || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join("&");
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    let httpPayload = `${this.method} ${this.path} HTTP/1.1\r\n`;
    httpPayload += `Host: ${this.host}:${this.port}\r\n`;

    httpPayload += Object.keys(this.headers)
      .map((key) => `${key}:${this.headers[key]}`)
      .join("\r\n");

    httpPayload += "\r\n\r\n";

    httpPayload += this.bodyText;
    return httpPayload;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          { host: this.host, port: this.port },
          () => {
            connection.write(this.toString());
          }
        );
      }

      connection.on("data", (data) => {
        console.log(data.toString());
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      });
      connection.on("error", (error) => {
        reject(error);
        connection.end();
      });
    });
  }
}

class ResponseParser {
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
}

class ChunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.currentState = this.WAITING_LENGTH;
  }
  receiveChar(char) {
    if (this.currentState === this.WAITING_LENGTH) {
      if (char === "0") {
        this.isFinished = true;
      } else if (char === "\r") {
        this.currentState = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.currentState === this.WAITING_LENGTH_LINE_END) {
      if (char === "\n") {
        if (this.length) {
          this.currentState = this.READING_TRUNK;
        } else {
          this.currentState = this.WAITING_NEW_LINE;
        }
      }
    } else if (this.currentState === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.currentState = this.WAITING_NEW_LINE;
      }
    } else if (this.currentState === this.WAITING_NEW_LINE) {
      if (char === "\r") {
        this.currentState = this.WAITING_NEW_LINE_END;
      }
    } else if (this.currentState === this.WAITING_NEW_LINE_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_LENGTH;
      }
    }
  }
}

void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8989",
    path: "/",
    headers: {
      "x-session-id": "session-id",
    },
    body: {
      name: "liupeixin",
    },
  });
  let response = await request.send();
  console.log(JSON.stringify(response));
})();
