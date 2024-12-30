const express = require("express");
const {addDocument, queryDocument, addAudioQuery, upload, getDocuments} = require("../controllers/embedding.controller");

const router = express.Router();

router.route("/document").post(addDocument);

router.route("/getAll-docs").get(getDocuments);

router.route("/query-embedding").post(queryDocument);

router.post("/audio-query", upload.single("audio"), addAudioQuery);

module.exports = router;