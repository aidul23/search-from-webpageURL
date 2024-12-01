const OpenAI = require("openai");

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const createEmbedding = async (text) => {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid input text for embedding");
    }

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    // Debug log the structure of embeddingResponse
    console.log("Received embeddingResponse:", JSON.stringify(embeddingResponse, null, 2));

    if (
      !embeddingResponse ||
      !embeddingResponse.data ||
      !Array.isArray(embeddingResponse.data) ||
      !embeddingResponse.data[0] ||
      !embeddingResponse.data[0].embedding
    ) {
      throw new Error("Unexpected API response structure");
    }

    const embedding = embeddingResponse.data[0].embedding;
    console.log("Extracted embedding:", embedding);

    return embedding;
  } catch (error) {
    console.error("Error creating embedding:", error.message || error);
    throw error;
  }
};


module.exports = { createEmbedding };
