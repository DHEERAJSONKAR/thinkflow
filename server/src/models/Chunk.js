const mongoose = require("mongoose");

const ChunkSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note"
  },

  text: {
    type: String
  },

  embedding: {
    type: [Number],
    default: []
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Chunk", ChunkSchema);