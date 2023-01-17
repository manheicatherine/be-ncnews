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
    .query(`SELECT * FROM articles WHERE article_id = ${id};`)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      } else {
        return rows;
      }
    });
};
