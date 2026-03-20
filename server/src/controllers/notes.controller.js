const Note = require("../models/Note");
const Chunk = require("../models/Chunk");
const ingestNote = require("../services/ingestion/documentIngest");

// Create Note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    if (title.length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters" });
    }

    if (content.length < 10) {
      return res.status(400).json({ message: "Content must be at least 10 characters" });
    }

    const note = new Note({
      userId: req.userId,
      title,
      content
    });

    await note.save();

    // AI ingestion pipeline
    try {
      await ingestNote(note);
    } catch (ingestError) {
      console.error("Ingestion error (non-critical):", ingestError);
      // Don't fail the note creation if ingestion fails
    }

    res.status(201).json({
      message: "Note created successfully",
      data: note
    });

  } catch (error) {
    console.error("Create Note Error:", error);
    res.status(500).json({ message: "Failed to create note" });
  }
};

// Get All Notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("_id title content createdAt updatedAt");

    res.json(notes);

  } catch (error) {
    console.error("Get Notes Error:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// Get Single Note
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Note ID is required" });
    }

    const note = await Note.findOne({
      _id: id,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);

  } catch (error) {
    console.error("Get Note Error:", error);
    res.status(500).json({ message: "Failed to fetch note" });
  }
};

// Update Note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Note ID is required" });
    }

    // Validation
    if (title && title.length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters" });
    }

    if (content && content.length < 10) {
      return res.status(400).json({ message: "Content must be at least 10 characters" });
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: id,
        userId: req.userId
      },
      { title, content, updatedAt: new Date() },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Re-ingest note if content changed
    if (content) {
      try {
        // Delete old chunks
        await Chunk.deleteMany({ noteId: id });
        // Re-ingest
        await ingestNote(note);
      } catch (ingestError) {
        console.error("Re-ingestion error:", ingestError);
      }
    }

    res.json({
      message: "Note updated successfully",
      data: note
    });

  } catch (error) {
    console.error("Update Note Error:", error);
    res.status(500).json({ message: "Failed to update note" });
  }
};

// Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Note ID is required" });
    }

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete associated chunks
    await Chunk.deleteMany({ noteId: id });

    res.json({ message: "Note deleted successfully" });

  } catch (error) {
    console.error("Delete Note Error:", error);
    res.status(500).json({ message: "Failed to delete note" });
  }
};