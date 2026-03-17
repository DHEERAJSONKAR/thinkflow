const fetch = require("node-fetch");

const createEmbedding = async (text) => {

  try {

    console.log("Calling embedding API...");

    const response = await fetch("https://api.jina.ai/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JINA_API_KEY}`
      },
      body: JSON.stringify({
        model: "jina-embeddings-v2-base-en",
        input: [text]
      })
    });

    const data = await response.json();

    console.log("Full API Response:", data);

    // Safety check
    if (!data || !data.data || !data.data[0]) {
      console.error("Invalid embedding response");
      return [];
    }

    return data.data[0].embedding;

  } catch (error) {
    console.error("Embedding Error:", error.message);
    return [];
  }
};

module.exports = createEmbedding;