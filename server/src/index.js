const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

// const app = require("express")();
// const http = require("http").Server(app);
// const io = require("socket.io")(http);

// io.on("connection", () => {
//   console.log("connected");
// });

// // io.on("connection", function (socket) {
// //   socket.on("new-operations", function (data) {
// //     io.emit("new-remote-operations", data);
// //   });
// // });

// http.listen(4000, function () {
//   console.log("listening on *:4000");
// });
