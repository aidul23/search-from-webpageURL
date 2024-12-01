const UploadDocument = require("../models/documentUpload.model");
const { runWebScraper } = require("../utils/runWebScraper");
const { createEmbedding } = require("../utils/createEmbedding");
const { hitOpenAiApi } = require("../utils/hitOpenAiApi");

const addDocument = async (req, res) => {
  try {
    const { url } = req.body;

    // there is a limit to text length, need to split text
    const { text } = await runWebScraper(url);

    const embedding = await createEmbedding(text);

    const newDoc = new UploadDocument({
      description: text,
      embedding: embedding,
    });

    const savedDoc = await newDoc.save();

    res.status(201).json({
      message: "Document uploaded successfully",
      document: savedDoc,
    });
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

const queryDocument = async (req, res) => {
  try {
    const { query } = req.body;

    const embedding = await createEmbedding(query);

    async function findSimilarDocuments(embedding) {
      try {
        // Query for similar documents.
        const documents = await UploadDocument.aggregate([
          {
            $search: {
              knnBeta: {
                vector: embedding,
                // path is the path to the embedding field in the mongodb collection documentupload
                path: "embedding",
                // change k to the number of documents you want to be returned
                k: 5,
              },
            },
          },
          {
            $project: {
              description: 1,
              score: { $meta: "searchScore" },
            },
          },
        ]);

        return documents;
      } catch (err) {
        console.error(err);
      }
    }

    const similarDocuments = await findSimilarDocuments(embedding);

    console.log("similarDocuments: ", similarDocuments);

    // gets the document with the highest score
    const highestScoreDoc = similarDocuments.reduce((highest, current) => {
      return highest.score > current.score ? highest : current;
    });

    console.log("highestScoreDoc", highestScoreDoc);

    const prompt = `Based on this context: ${highestScoreDoc.description} \n\n Query: ${query} \n\n Answer:`;

    const answer = await hitOpenAiApi(prompt);
    console.log("answer: ", answer);
    res.send(answer);
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

module.exports = { addDocument, queryDocument };
