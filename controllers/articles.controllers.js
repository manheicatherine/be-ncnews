const {
  fetchArticles,
  fetchArticlesById,
  fetchCommentsByArticleId,
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
  const method1 = fetchCommentsByArticleId(article_id);
  const method2 = fetchArticlesById(article_id);

  Promise.all([method1, method2])
    .then((result) => {
      const comments = result[0];
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};
