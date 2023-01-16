const express = require("express");
const app = express();
const {getTopics} = require("./controllers/news.controllers");


app.get("/api/topics", getTopics)


module.exports = { app };
