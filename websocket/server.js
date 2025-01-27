const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

// Crear una instancia de Express
const app = express();

// Crear un servidor HTTP para Express
const server = http.createServer(app);

// Configurar CORS en Socket.IO para permitir conexiones desde tu frontend
const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
  path: "/socket",
  transports: ['websocket'],
});

// middleware
app.use(express.json());
app.use(cors());

let messages = {};

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on('join', (room) => {
    console.log(`Socket ${socket.id} joining to sesion: ${room}`);
    socket.join(room);
    if (messages[room]) {
      socket.emit('chat history', messages[room]);
    } else {
      messages[room] = [];
    }
  });

  socket.on('chat', (data) => {
    const { room, message } = data;

    if (!messages[room]) {
      messages[room] = [];
    }
    messages[room].push(message);

    console.log(`
      sender: ${message.sender.nombre}
      msg: ${message.text}
      time: ${message.time}
      room: ${room}
    `);

    io.to(room).emit('chat', message);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`)
  });
});

// Iniciar el servidor en el puerto 8080
server.listen(8080, () => {
  console.log('Servidor WebSocket escuchando en http://localhost:8080');
});
