import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { createNote } from "../services/notes";

const AddNoteModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });

  const handleSubmit = async () => {
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (form.title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    if (!form.content.trim()) {
      setError("Please enter content");
      return;
    }

    if (form.content.length < 10) {
      setError("Content must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      await createNote(form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create note");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, title: value });
    setCharCount({ ...charCount, title: value.length });
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, content: value });
    setCharCount({ ...charCount, content: value.length });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-md shadow-2xl animate-[slideIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white">Create New Note</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Error Message */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex gap-3 items-start">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Title Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <span className={`text-xs ${charCount.title < 3 ? 'text-red-400' : 'text-gray-400'}`}>
                {charCount.title}/100
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter note title..."
              maxLength={100}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-primary-600/50 focus:ring-2 focus:ring-primary-600/20 transition-all outline-none"
              value={form.title}
              onChange={handleTitleChange}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Content Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Content
              </label>
              <span className={`text-xs ${charCount.content < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                {charCount.content}/5000
              </span>
            </div>
            <textarea
              placeholder="Write or paste your note content here..."
              maxLength={5000}
              className="w-full h-40 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-primary-600/50 focus:ring-2 focus:ring-primary-600/20 transition-all outline-none resize-none"
              value={form.content}
              onChange={handleContentChange}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-2">Ctrl+Enter to submit</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t border-white/10 bg-white/5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || form.title.length < 3 || form.content.length < 10}
            className="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 text-white font-semibold transition-all shadow-lg shadow-primary-600/20"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating...
              </div>
            ) : (
              "Create Note"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;