const express = require("express");
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());


const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticles,
  getArticlesById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleByArticleId,
  deleteCommentByCommentId
  
} = require("./controllers/articles.controllers");
const {getUsers} =require('./controllers/users.controllers')

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleByArticleId);
app.get("/api/users", getUsers );
app.delete("/api/comments/:comment_id", deleteCommentByCommentId); 













app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code) {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "Internal Server Error" });
});
module.exports = { app };
