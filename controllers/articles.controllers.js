const {
  fetchArticles,
  fetchArticlesById,
  fetchCommentsByArticleId
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    fetchCommentsByArticleId(article_id)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch((error) => {
        next(error);
      });
  };