import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles } from "lucide-react";
import Toast from "../components/Toast";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [toast, setToast] = useState(null);

  const bottomRef = useRef();
  const inputRef = useRef();

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);
    const currentInput = input;
    setInput("");

    try {
      const res = await API.post("/ai/ask", {
        question: currentInput,
        noteId: selectedNote?._id
      });

      if (res.data?.answer) {
        const aiMessage = {
          role: "ai",
          text: res.data.answer
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to get response. Please try again.";
      showToast(errorMsg, "error");
      console.error(err);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    "Summarize this note",
    "Explain in simple terms",
    "Give key points",
    "Create interview questions"
  ];

  return (
    <Layout onSelectNote={setSelectedNote}>
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
        
        {/* Selected Note Header */}
        {selectedNote && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border border-primary-600/30 animate-[slideIn_0.3s_ease-out]">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-primary-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-400">Chatting about</p>
                <h3 className="font-semibold text-sm sm:text-base text-white truncate">
                  {selectedNote.title}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 sm:pr-4 mb-4 sm:mb-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Sparkles size={48} className="mx-auto mb-4 text-primary-600/50" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-300 mb-2">
                  {selectedNote ? "Start asking questions" : "Select a note to begin"}
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  {selectedNote
                    ? "Ask anything about the selected note"
                    : "Choose a note from the sidebar to get started"}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-[slideIn_0.3s_ease-out]`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-2xl px-4 py-3 sm:py-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/20"
                    : "bg-white/10 border border-white/20 text-gray-100 text-left"
                }`}
              >
                {msg.role === "ai" ? (
                  <div className="prose prose-invert max-w-none text-sm sm:text-base">
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                        strong: ({node, ...props}) => <strong {...props} className="font-semibold text-white" />,
                        code: ({node, ...props}) => <code {...props} className="bg-black/30 px-1.5 py-0.5 rounded text-primary-300 text-xs" />,
                        ul: ({node, ...props}) => <ul {...props} className="list-disc list-inside mb-2" />,
                        ol: ({node, ...props}) => <ol {...props} className="list-decimal list-inside mb-2" />,
                        li: ({node, ...props}) => <li {...props} className="mb-1" />,
                        h1: ({node, ...props}) => <h1 {...props} className="text-lg font-bold mb-2" />,
                        h2: ({node, ...props}) => <h2 {...props} className="text-base font-bold mb-2" />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base break-words">{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-start animate-[slideIn_0.3s_ease-out]">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/10 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* Suggested Prompts */}
        {selectedNote && messages.length === 0 && (
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-400 mb-3">Try asking:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2 sm:gap-3 bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none resize-none text-sm sm:text-base max-h-24"
            placeholder={
              selectedNote
                ? "Ask about this note... (Shift+Enter for new line)"
                : "Select a note to ask questions..."
            }
            disabled={loading || !selectedNote}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={loading || !selectedNote || !input.trim()}
            className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30"
          >
            <Send size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

    </Layout>
  );
};

export default Chat;