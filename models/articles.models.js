const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT * FROM articles LEFT OUTER JOIN comments ON comments.created_at = articles.created_at ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      const addCommentCount = rows.map((eachObj) => {
        delete eachObj.body;
        delete eachObj.comment_id;
        eachObj.comment_count = eachObj.article_id;
        return eachObj;
      });
      const checkVal = Object.values(addCommentCount[0]);
      
      if (checkVal.includes(null)) {
        return Promise.reject({ status: 404, msg: `Path not found!` });
      } else {
        return addCommentCount;
      }
    });
};
