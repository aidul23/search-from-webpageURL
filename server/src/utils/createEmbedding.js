const OpenAI = require("openai");

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const createEmbedding = async (text) => {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  const [{ embedding }] = embeddingResponse?.data?.data;

  console.log("embedding", embedding);

  return embedding;
};

module.exports = { createEmbedding };
