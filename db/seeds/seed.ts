const format = require("pg-format");
const dbSeed = require("../connection.ts");

const seed = () => {
    console.log("inside the seed func")
  return dbSeed.query(`DROP TABLE IF EXISTS items`).then(() => {
    console.log("inside the first db seed")
    return dbSeed.query(`CREATE TABLE items (
        item_id SERIAL PRIMARY KEY,
        item_name VARCHAR NOT NULL,
        item_price INT NOT NULL,
        purchase_date TIMESTAMP NOT NULL,
        expiry_date TIMESTAMP NOT NULL,
        );`);
  });
};

module.exports = seed;

