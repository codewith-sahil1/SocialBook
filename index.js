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
  });
  socket.on('joinroom',(roomName)=>{
    for(let room of socket.rooms){
      if(room!=socket.id){
        socket.leave(room);
      }
    }
     socket.join(roomName);
     console.log(`user joined ${roomName}`);
     io.to(roomName).emit('message',`welcome to the ${roomName}`);
  });

  socket.on('chat message',(roomName,message) => {
    // If message is a string (simple text message)
    if (typeof message === 'string') {
      console.log(`Text message from ${socket.username}: ${message}`);
      io.to(roomName).emit('chat message', {
        username: socket.username,
        text: message
      });
    }
    // If message is an object with text property (text message wrapped in object)
    else if (typeof message === 'object' && message.text) {
      console.log(`Text message (object) from ${socket.username}: ${message.text}`);
      io.to(roomName).emit('chat message', {
        username: socket.username,
        text: message.text
      });
    }
    // If message is an object with file property (file message)
    else if (typeof message === 'object' && message.file) {
      console.log(`File message from ${message.username || socket.username}: ${message.file.name}`);
      io.to(roomName).emit('chat message', {
        username: message.username || socket.username,
        file: message.file
      });
    }
  });
});

app.get("", (req, res) => {
  return res.sendFile(path.resolve("./public/index.html"));
});

//server.listen(8000, () => console.log(`🚀 Server started at: http://localhost:8000`));
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
