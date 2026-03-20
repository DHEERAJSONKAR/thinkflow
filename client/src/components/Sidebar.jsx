import { useEffect, useState } from "react";
import { Plus, LogOut, Edit2, Trash2, Search } from "lucide-react";
import AddNoteModal from "./AddNoteModal";
import EditNoteModal from "./EditNoteModal";
import { getNotes } from "../services/notes";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Toast from "./Toast";

const Sidebar = ({ onSelectNote, onClose }) => {
  const { logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await getNotes();
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load notes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNote = (note) => {
    onSelectNote(note);
    setActiveNoteId(note._id);
    if (onClose) onClose();
  };

  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await API.delete(`/notes/${noteId}`);
      setNotes(notes.filter(n => n._id !== noteId));
      if (activeNoteId === noteId) {
        setActiveNoteId(null);
        onSelectNote(null);
      }
      showToast("Note deleted successfully", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete note", "error");
    }
  };

  const handleEditNote = (note, e) => {
    e.stopPropagation();
    setEditingNote(note);
    setShowEditModal(true);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleAddNoteSuccess = () => {
    setShowAddModal(false);
    fetchNotes();
    showToast("Note created successfully", "success");
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchNotes();
    showToast("Note updated successfully", "success");
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl border-r border-white/10 p-4 sm:p-6 flex flex-col">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">ThinkFlow</h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">AI-powered note taking</p>
      </div>

      {/* Add Note Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold mb-6 transition-all shadow-lg shadow-primary-600/20 glow"
      >
        <Plus size={20} />
        <span className="hidden sm:inline">New Note</span>
        <span className="sm:hidden">New</span>
      </button>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm outline-none focus:border-primary-600/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-4 h-4 border-2 border-white/30 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">{searchQuery ? "No matching notes" : "No notes yet"}</p>
            <p className="text-xs mt-2">
              {searchQuery ? "Try a different search" : "Create your first note to get started"}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              onClick={() => handleSelectNote(note)}
              className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
                activeNoteId === note._id
                  ? "bg-primary-600/20 border border-primary-600/50 text-white"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <h3 className="font-medium text-sm sm:text-base truncate group-hover:text-white transition-colors">
                {note.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {note.content?.substring(0, 50) || "No description"}...
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEditNote(note, e)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={(e) => handleDeleteNote(note._id, e)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold transition-all mt-4"
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Logout</span>
      </button>

      {/* Modals */}
      {showAddModal && (
        <AddNoteModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddNoteSuccess}
        />
      )}

      {showEditModal && editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
};

export default Sidebar;