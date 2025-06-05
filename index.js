const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));

io.on('connection', (socket) => {
  console.log('A new user has connected');

  socket.on('set username', (username) => {
    socket.username = username;
    console.log(`${username} has joined the chat`);
  });

  socket.on('chat message', (message) => {
    console.log(`Message from ${socket.username}: ${message}`);
    io.emit('chat message', {
      username: socket.username,
      text: message
    });
  });
});

app.get("", (req, res) => {
  return res.sendFile(path.resolve("./public/index.html"));
});

server.listen(8000, () => console.log(`🚀 Server started at: http://localhost:8000`));
