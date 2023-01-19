const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      const deleteUnuseItem = rows.map((each) => {
        delete each.body;
        return each;
      });
      return deleteUnuseItem;
    });
};

exports.fetchArticlesById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      } else {
        return rows;
      }
    });
};

exports.fetchCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
      } else if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      } else {
        return rows;
      }
    });
};

exports.addComment = (id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [id, username, body]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      } else {
        return rows;
      }
    });
};

exports.updateArticleByArticleId = (id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      } else {
        return rows[0];
      }
    });
};
