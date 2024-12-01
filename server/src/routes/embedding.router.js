const express = require("express");
const {addDocument} = require("../controllers/embedding.controller");

const router = express.Router();

router.route("/document").post(addDocument);

module.exports = router;