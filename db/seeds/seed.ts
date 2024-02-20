// const format = require("pg-format");
import connectionOne from "../connection";

export default function seed(data) {
  return connectionOne
    .query("DROP TABLE IF EXISTS items")
    .then(() => {
      return connectionOne.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return connectionOne.query("DROP TABLE IF EXISTS homes");
    })
    .then(() => {
      return connectionOne.query(`CREATE TABLE homes (
      home_id SERIAL PRIMARY KEY,
      home_name VARCHAR NOT null
      );`);
    })
    .then(() => {
      return connectionOne.query(`CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      user_name VARCHAR NOT null,
      home_id INT REFERENCES homes(home_id) NOT NULL
      );`);
    })
    .then(() => {
      return connectionOne.query(`CREATE TABLE items (
      item_id SERIAL PRIMARY KEY,
      item_name VARCHAR NOT NULL,
      item_price INT NOT NULL,
      purchase_date TIMESTAMP NOT NULL,
      expiry_date TIMESTAMP NOT NULL,
      home_id INT REFERENCES homes(home_id) NOT NULL
      );`);
    })
}
