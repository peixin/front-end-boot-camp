const http = require("http");

http
  .createServer((request, response) => {
    console.log("request received:");
    console.log(request.headers);
    response.setHeader("Content-Type", "text/html");
    response.setHeader("X-Foo", "bar");
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body div #myid {
      width: 100px;
      background-color: #ff5000;
    }

    body div img {
      width: 30px;
      background-color: #ff1111;
    }
  </style>
</head>
<body>
  <div>
    <img id="myid"/>
    <img/>
  </div>
</body>
</html>`
    );
  })
  .listen(8989);

console.log("server created");
