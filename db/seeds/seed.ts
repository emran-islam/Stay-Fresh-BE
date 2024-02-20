import format from "pg-format";
import connectionOne from "../connection";

type dataObject = {
  homesData: { home_name: string }[];
  usersData: { user_name: string; home_id: number }[];
  itemsData: {
    item_name: string;
    item_price: number;
    purchase_date: string;
    expiry_date: string;
    home_id: number;
  }[];
};

export default function seed(data: dataObject) {
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
    .then(() => {
      const insertHomesQueryStr = format(
        "INSERT INTO homes (home_name) VALUES %L;",
        data.homesData.map((home) => [home.home_name])
      );
      return connectionOne.query(insertHomesQueryStr);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (user_name, home_id) VALUES %L;",
        data.usersData.map((user) => [user.user_name, user.home_id])
      );
      return connectionOne.query(insertUsersQueryStr);
    }).then(()=>{
         const insertItemsQueryStr = format(
           "INSERT INTO items (item_name, item_price, purchase_date, expiry_date, home_id) VALUES %L;",
           data.itemsData.map((item) => [
             item.item_name,
             item.item_price,
             item.purchase_date,
             item.expiry_date,
             item.home_id,
           ])
         );
         return connectionOne.query(insertItemsQueryStr);
    });
}
