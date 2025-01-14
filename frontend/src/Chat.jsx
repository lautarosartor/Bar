import { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Asegúrate de tener esta dependencia instalada

const Chat = () => {
  const [messages, setMessages] = useState([]);  // Estado para los mensajes del chat
  const [input, setInput] = useState('');         // Estado para el mensaje del input
  const [socket, setSocket] = useState(null);     // Estado para la conexión WebSocket

  useEffect(() => {
    // Conectar al servidor WebSocket en el backend
    const socket = io('http://localhost:8080');
    setSocket(socket);

    // Recibir el historial de mensajes al conectarse
    socket.on('chat history', (history) => {
      setMessages(history);
    });

    // Escuchar los mensajes nuevos
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (socket && input.trim() !== '') {
      // Hacer una solicitud POST a tu servidor para guardar el mensaje en la base de datos
      try {
        await fetch('http://localhost:7001/public/pedido', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        // Limpiar el campo de entrada después de enviar el mensaje
        setInput('');
      } catch (error) {
        console.error('Error al guardar el mensaje:', error);
      }
    }
  };

  return (
    <div className="text-white bg-[#f00]">
      <h1>Chat en Tiempo Real</h1>
      <div
        id="messages"
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') sendMessage();
        }}
        placeholder="Escribe un mensaje..."
        style={{ width: '100%', padding: '10px', color: '#000' }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
