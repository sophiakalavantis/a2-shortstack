const http = require("http"),
  fs = require("fs"),
  mime = require("mime"),
  dir = "public/",
  port = 3000;

let tasks = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);
  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/tasks") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(tasks));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const parsedData = JSON.parse(dataString);
    if (request.url === "/add") {
      const task = {
        task: parsedData.task,
        priority: parsedData.priority,
        created_at: new Date().toISOString(),
        deadline: calculateDeadline(parsedData.priority),
      };
      tasks.push(task);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(task));
    } else if (request.url === "/clear") {
      tasks = [];
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("Tasks cleared");
    }
  });
};

function calculateDeadline(priority) {
  const currentDate = new Date();
  if (priority === "high") {
    return new Date(
      currentDate.getTime() + 1 * 24 * 60 * 60 * 1000
    ).toISOString();
  } else if (priority === "medium") {
    return new Date(
      currentDate.getTime() + 3 * 24 * 60 * 60 * 1000
    ).toISOString();
  } else {
    return new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
  }
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename);
  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHead(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHead(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
