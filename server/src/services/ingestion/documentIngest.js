const chunkText = require("../../utils/chunkText");
const Chunk = require("../../models/Chunk");
const createEmbedding = require("../embeddings/createEmbedding");

const ingestNote = async (note) => {

  const chunks = chunkText(note.content);

  const chunkDocs = [];

  for (let text of chunks) {

    const embedding = await createEmbedding(text);

    chunkDocs.push({
      userId: note.userId,
      noteId: note._id,
      text,
      embedding
    });

  }

  await Chunk.insertMany(chunkDocs);
};

module.exports = ingestNote;