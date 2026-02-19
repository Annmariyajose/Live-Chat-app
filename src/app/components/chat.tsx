import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000");

interface Message {
  username: string;
  message: string;
  createdAt?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("User1");

  useEffect(() => {
    // Receive messages
    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!text) return;

    const messageData = {
      username,
      message: text,
    };

    socket.emit("send_message", messageData);
    setText("");
  };

  return (
    <div>
      <h2>Real Time Chat</h2>

      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}: </strong>
            {msg.message}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={text}
        placeholder="Type message..."
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
