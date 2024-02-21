import db from "../db/connection";
import items from "../db/data/test-data/items";

export function fetchHomes() {
  return db.query(`SELECT * FROM homes`).then((result) => {
    return result.rows;
  });
}

export function fetchItemsByHomeId(home_id) {
  return db
    .query(
      `SELECT * FROM items 
    WHERE home_id = $1;`,
      [home_id]
    )
    .then((result) => {
      return result.rows;
    });
}


