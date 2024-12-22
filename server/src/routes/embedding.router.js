const express = require("express");
const {addDocument, queryDocument, addAudioQuery, upload} = require("../controllers/embedding.controller");

const router = express.Router();

router.route("/document").post(addDocument);

router.route("/query-embedding").post(queryDocument);

router.post("/audio-query", upload.single("audio"), addAudioQuery);

module.exports = router;