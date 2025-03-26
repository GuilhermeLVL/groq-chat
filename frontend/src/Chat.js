import { useState } from "react";
import "./Chat.css";

export default function ChatApp() {
  const [apiKey, setApiKey] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim() || !apiKey.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, api_key: apiKey }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages([...messages, userMessage, { role: "bot", content: `Erro: ${data.error}` }]);
      } else {
        setMessages([...messages, userMessage, { role: "bot", content: data.reply }]);
      }
    } catch (error) {
      setMessages([...messages, userMessage, { role: "bot", content: "Erro ao conectar ao servidor." }]);
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-header">Chat GROQ </h1>
      <input
        type="password"
        className="chat-input"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Insira sua API Key"
      />
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua mensagem..."
      />
      <button
        className="chat-button"
        onClick={sendMessage}
      >Enviar</button>
    </div>
  );
}
