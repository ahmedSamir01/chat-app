const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.1.4:5173"],
    methods: ["GET", "POST"],
  },
});

let messages = [];
let roomId = "";

io.on("connection", (socket) => {
  socket.on("join_room", (data, callback) => {
    // initiate the room messages
    if (roomId === data && messages?.length) {
      socket.emit("init_room", messages);
      console.log("exist");
    } else {
      messages = [];
      roomId = "";

      console.log("empty");
    }
    console.log({ roomId, data, messages });
    socket.join(data);
    roomId = data;

    // Acknowledge the client by calling the callback
    callback && callback();
  });

  socket.on("send_message", (data, callback) => {
    messages.push(data);
    // send message to room members , whos have same roomID
    socket.to(10000).emit("receive_message", messages);

    callback && callback(messages);
  });

  socket.on("disconnect", () => {});
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
