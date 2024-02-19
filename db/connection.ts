// import { Pool } from "pg";
const { Pool } = require("pg");


const ENV = process.env.NODE_ENV || "development";


console.log("ENV >>> ", ENV)

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE /*&& !process.env.DATABASE_URL*/) {
  console.log("log inside connection file")
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config)

// export const pool = new Pool(config);

