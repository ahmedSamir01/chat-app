const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.1.6:5173"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data, callback) => {
    socket.join(data);

    // Acknowledge the client by calling the callback
    callback && callback();
  });

  socket.on("send_message", (data, callback) => {
    // send message to room members , whos have same roomID
    socket.to(data.room).emit("receive_message", data);

    callback && callback(data);
  });

  socket.on("disconnect", () => {});
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

/*
socket.on("leave_room", (data, callback) => {
    // Leave the room
    socket.leave(data);
    // socket.leaveAll();

    // Notify all clients in the room that someone is leaving
    socket.to(data).emit("user_left");
    // socket.except("").emit("user_left");

    // Acknowledge the client by calling the callback
    callback && callback();
  });
*/
