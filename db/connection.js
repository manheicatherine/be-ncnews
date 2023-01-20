const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
const pathToCorrectEnvFile = `${__dirname}/../.env.${ENV}`;
require("dotenv").config({ path: pathToCorrectEnvFile });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("No PGDATABASE or URL set");
}
const config = ENV === "production" ?{connectionString: process.env.DATABASE_URL, max:2} : {connectionString: process.env.DATABASE}

module.exports = new Pool(config);
