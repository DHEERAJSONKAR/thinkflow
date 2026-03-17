const createEmbedding = require("../services/embeddings/createEmbedding");
const similaritySearch = require("../services/vector/similaritySearch");

exports.askAI = async (req, res) => {

  try {

    const { question } = req.body;

    const embedding = await createEmbedding(question);

    const chunks = await similaritySearch(embedding, req.userId);

    const context = chunks.map(c => c.text).join("\n");

    res.json({
      context
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};