const Note = require("../models/Note");
const ingestNote = require("../services/ingestion/documentIngest");



// Create Note
exports.createNote = async (req, res) => {
  try {

    const { title, content } = req.body;

    const note = new Note({
      userId: req.userId,
      title,
      content
    });

    await note.save();

    // AI ingestion pipeline
    await ingestNote(note);

    res.status(201).json(note);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Notes
exports.getNotes = async (req, res) => {
  try {

    const notes = await Note.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(notes);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Single Note
exports.getNoteById = async (req, res) => {
  try {

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    res.json(note);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update Note
exports.updateNote = async (req, res) => {
  try {

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId
      },
      req.body,
      { new: true }
    );

    res.json(note);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete Note
exports.deleteNote = async (req, res) => {
  try {

    await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    res.json({ message: "Note deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};