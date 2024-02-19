// const format = require("pg-format");
const connectionOne = require("../connection.ts");

function seed() {
  return connectionOne.query("DROP TABLE IF EXISTS items").then(()=> {
    return connectionOne.query(`CREATE TABLE items (
        item_id SERIAL PRIMARY KEY,
        item_name VARCHAR NOT NULL,
        item_price INT NOT NULL,
        purchase_date TIMESTAMP NOT NULL,
        expiry_date TIMESTAMP NOT NULL
        );`);
  });
};

module.exports = seed;

