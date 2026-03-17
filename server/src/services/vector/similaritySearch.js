const Chunk = require("../../models/Chunk");

const similaritySearch = async (embedding, userId) => {

  const chunks = await Chunk.find({ userId });

  const scored = chunks.map(chunk => {

    const score = cosineSimilarity(embedding, chunk.embedding);

    return { chunk, score };

  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 5).map(item => item.chunk);
};

function cosineSimilarity(a, b) {

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

  return dot / (magA * magB);
}

module.exports = similaritySearch;