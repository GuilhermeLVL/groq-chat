import { useState } from "react";

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
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold">Chat com Groq</h1>
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Insira sua API Key"
      />
      <div className="h-64 overflow-y-auto border p-2 my-2">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "text-right" : "text-left"}>
            <p className="p-2 my-1 rounded-md bg-gray-100">{msg.content}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua mensagem..."
      />
      <button
        className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md"
        onClick={sendMessage}
      >Enviar</button>
    </div>
  );
}
