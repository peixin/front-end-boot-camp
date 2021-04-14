const http = require("http");

http
  .createServer((request, response) => {
    let body = [];
    request
      .on("error", (error) => {
        console.error(error);
      })
      .on("data", (chunk) => {
        body.push(chunk.toString());
      })
      .on("end", () => {
        console.log("body:", body);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(" Hello World!");
      });
  })
  .listen(8989);

console.log("server created");
