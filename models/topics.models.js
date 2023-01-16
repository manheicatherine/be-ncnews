const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");


exports.fetchTopics = () => {
  return db.query(`SELECT * FROM  topics;`).then(({ rows }) => {
    return rows;
  });
};


