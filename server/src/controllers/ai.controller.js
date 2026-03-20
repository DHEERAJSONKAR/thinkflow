const createEmbedding = require("../services/embeddings/createEmbedding");
const similaritySearch = require("../services/vector/similaritySearch");
const generateAnswer = require("../services/ai/generateAnswer");

exports.askAI = async (req, res) => {
  try {
    const { question, noteId } = req.body;

    // Validation
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (question.length > 5000) {
      return res.status(400).json({ message: "Question is too long" });
    }

    try {
      // Step 1: Create embedding
      const embedding = await createEmbedding(question);

      if (!embedding || embedding.length === 0) {
        return res.status(500).json({ message: "Failed to process question" });
      }

      // Step 2: Vector search
      const chunks = await similaritySearch(embedding, req.userId, noteId);

      if (!chunks || chunks.length === 0) {
        return res.json({
          message: "No relevant information found",
          answer: "I couldn't find relevant information in your notes to answer this question. Please try asking something related to your notes or add more content."
        });
      }

      const context = chunks.map(c => c.text).join("\n");

      // Step 3: Generate AI answer
      const answer = await generateAnswer(question, context);

      res.json({
        message: "Success",
        answer,
        sources: chunks.length
      });

    } catch (serviceError) {
      console.error("Service Error:", serviceError.message);
      return res.status(500).json({
        message: "Failed to process your question",
        answer: "There was an error processing your question. Please try again."
      });
    }

  } catch (error) {
    console.error("Ask AI Error:", error);
    res.status(500).json({
      message: "Server error",
      answer: "An unexpected error occurred. Please try again later."
    });
  }
};