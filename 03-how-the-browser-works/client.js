const net = require("net");
const path = require("path");
const images = require("images");
const ResponseParser = require("./response-parser");
const parser = require("./parser");
const render = require("./render");

const rootDir = path.resolve(__filename, "..");

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
        // console.log(data.toString());
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
  const dom = parser.parserHTML(response.body);
  const viewport = images(800, 600);
  render(viewport, dom);
  viewport.save(path.join(rootDir, "viewport.jpg"));
})();
