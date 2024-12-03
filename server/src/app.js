const express = require("express");
const cors = require("cors");

require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());

const embeddingRouter = require("./routes/embedding.router");

app.use("/api/embedding", embeddingRouter);

module.exports = { app };
