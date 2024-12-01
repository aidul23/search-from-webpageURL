const mongoose = require("mongoose");

const documentUploadSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileName: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  embedding: [Number],
});

module.exports = mongoose.model("Document", documentUploadSchema);
