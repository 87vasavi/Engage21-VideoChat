const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

// paste your IP address of the local network


// specify the self-signed certificate for https connection
const server = require("http").createServer(app);
const io = require("socket.io")(server);

//app.use(express.static("public"));
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
  });

var socketRoom;

io.on("connection", socket => {
  console.log("user connected to the socket");

  socket.on("room", room => {
    io.emit("room", room);
  });

  socket.on("msgUser",({msg,me})=>{
    console.log(msg)
    io.to(socketRoom).emit("msgUser",{msg,me});
  })

  socket.on("join", room => {
    socketRoom = room;
    socket.join(socketRoom);
    console.log(socketRoom);
    socket.to(socketRoom).emit("join", room);
  });

  socket.on("offer", offer => {
    socket.to(socketRoom).emit("offer", offer);
  });

  socket.on("answer", answer => {
    socket.to(socketRoom).emit("answer", answer);
  });

  socket.on("candidate", candidate => {
    socket.to(socketRoom).emit("candidate", candidate);
  });
});

server.listen(PORT,() => {
  console.log("Server is listening: ", PORT);
});