const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateAnswer = async (question, context) => {

  try {

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ FINAL WORKING MODEL
      messages: [
        {
          role: "system",
          content: "Answer only using provided context. If answer not found, say 'No relevant info found.'"
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${question}`
        }
      ]
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("Groq Error:", error.message);
    return "AI temporarily unavailable";
  }
};

module.exports = generateAnswer;