const {
  fetchArticles,
  fetchArticlesById,
  fetchCommentsByArticleId,
  addComment,
  updateArticleByArticleId,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const { topic } = req.body;
  const { order } = req.body;
  const { sort_by } = req.body;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
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

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  addComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleByArticleId(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
