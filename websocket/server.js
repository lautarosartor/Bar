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
    // methods: ["GET", "POST"],
  },
  path: "/socket"
});

// middleware
app.use(express.json());
app.use(cors());

// Array para almacenar los mensajes (opcional, si deseas guardar el historial)
let messages = [];

// Conexión con cada cliente
io.on('connection', (socket) => {
  console.log('Un cliente se conectó');

  // Enviar los mensajes previos al cliente que se conecta
  socket.emit('chat history', messages);

  // Escuchar los mensajes enviados desde los clientes
  socket.on('chat message', (msg) => {
    console.log('Mensaje recibido:', msg);

    // Guardar el mensaje en el historial (opcional)
    messages.push(msg);

    // Emitir el mensaje a todos los clientes conectados
    io.emit('chat message', msg);
  });

  // Manejar desconexiones
  socket.on('disconnect', () => {
    console.log('Un cliente se desconectó');
  });
});

// Iniciar el servidor en el puerto 8080
server.listen(8080, () => {
  console.log('Servidor WebSocket escuchando en http://localhost:8080');
});
