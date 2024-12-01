const express = require("express");
const {addDocument, queryDocument} = require("../controllers/embedding.controller");

const router = express.Router();

router.route("/document").post(addDocument);

router.route("/query-embedding").post(queryDocument);

module.exports = router;