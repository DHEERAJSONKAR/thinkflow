const Chunk = require("../../models/Chunk");

const similaritySearch = async (embedding, userId, noteId) => {

  // ✅ Query build
  const query = {
    userId,
    embedding: { $ne: [] } // skip empty embeddings
  };

  // ✅ Filter by note if selected
  if (noteId) {
    query.noteId = noteId;
  }

  const chunks = await Chunk.find(query);

  // ✅ Score calculation
  const scored = chunks.map(chunk => {

    const score = cosineSimilarity(embedding, chunk.embedding);

    return { chunk, score };

  });

  // ✅ Sort by similarity
  scored.sort((a, b) => b.score - a.score);

  // ✅ Top K (better accuracy)
  return scored.slice(0, 3).map(item => item.chunk);
};


// ✅ cosine similarity
function cosineSimilarity(a, b) {

  if (!a || !b || a.length !== b.length) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}

module.exports = similaritySearch;