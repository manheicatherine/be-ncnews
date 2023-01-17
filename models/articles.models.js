const db = require("../db/connection");

exports.fetchArticles = () => {
//   const commentArr = db.query(`SELECT * FROM comments;`).then(({ rows }) => {
//     const commentObj = rows.map((each) => {
//       return each.article_id;
//     });

//     const counts = {};
//     const keyVal = commentObj.forEach((x) => {
//       counts[x] = (counts[x] || 0) + 1;
//     });

    const articleArr = db
      .query(`SELECT * FROM articles ORDER BY created_at DESC;`)
      .then(({ rows }) => {
        const deleteUnuseItem = rows.map((each) => {
        //   each.comment_count = counts[(each.article_id)];
          delete each.body;
          return each;
        });
        console.log(deleteUnuseItem);
      });
//   });
};

//   const addCommentCount = rows.map((eachObj) => {
//     delete eachObj.body;
//     delete eachObj.comment_id;
//     eachObj.comment_count = eachObj.article_id;
//     return eachObj;
//   });
//   const checkVal = Object.values(addCommentCount[0]);

//   if (checkVal.includes(null)) {
//     return Promise.reject({ status: 404, msg: `Path not found!` });
//   } else {
//     return addCommentCount;
//   }
