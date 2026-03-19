const createEmbedding = require("../services/embeddings/createEmbedding");
const similaritySearch = require("../services/vector/similaritySearch");
const generateAnswer = require("../services/ai/generateAnswer");

exports.askAI = async (req, res) => {

  try {

    const { question } = req.body;

    // Step 1: embedding
    const embedding = await createEmbedding(question);

    // Step 2: vector search
    const chunks = await similaritySearch(embedding, req.userId);

    const context = chunks.map(c => c.text).join("\n");

    // Step 3: AI answer
    const answer = await generateAnswer(question, context);

    res.json({
      answer
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};