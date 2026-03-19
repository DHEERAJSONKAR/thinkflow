import { useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;

    // Add user message
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await API.post("/ai/ask", {
        question: input
      });

      const aiMessage = {
        role: "ai",
        text: res.data.answer
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error(error);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-md ${
                  msg.role === "user"
                    ? "bg-indigo-600"
                    : "bg-white/10"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400">AI is thinking...</div>
          )}

        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-white/10 outline-none"
            placeholder="Ask something..."
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 px-4 rounded-lg"
          >
            Send
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default Chat;