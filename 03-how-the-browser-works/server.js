const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__filename, "..");

const readHTMLContent = () => {
  return fs.readFileSync(path.join(rootDir, "demo.html")).toString();
}

http
  .createServer((request, response) => {
    console.log("request received:");
    console.log(request.headers);
    response.setHeader("Content-Type", "text/html");
    response.setHeader("X-Foo", "bar");
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end(readHTMLContent());
  })
  .listen(8989);

console.log("server created");
