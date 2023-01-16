const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getArticles } = require("./controllers/articles.controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
    if (err.code) {
        response.status (400).send({ msg: 'Bad request' });
        } else {
            next (err);
        }
    })


    app.use((err, request, response, next) => {
        console. log (err);
        response. status (500) .send({ msg: 'Internal Server Error' });
        });
    module.exports = { app };
