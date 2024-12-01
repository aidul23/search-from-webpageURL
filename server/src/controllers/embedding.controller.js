const UploadDocument = require("../models/documentUpload.model");
const {runWebScraper} = require("../utils/runWebScraper");
const {createEmbedding} = require("../utils/createEmbedding");

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


module.exports = {addDocument}
