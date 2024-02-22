import db from "../db/connection";
// import items from "../db/data/test-data/items";

export function fetchHomes() {
  return db.query(`SELECT * FROM homes`).then((result) => {
    return result.rows;
  });
}

export function fetchItemsByHomeId(home_id) {
  return db
    .query(
      `SELECT * FROM items 
    WHERE home_id = $1 ORDER BY expiry_date ASC;`,
      [home_id]
    )
    .then((result) => {
      return result.rows;
    });
}

export function addItemByHomeId(newItem, home_id) {
    return db
      .query(
        `
  INSERT INTO items
  (item_name, item_price, purchase_date, expiry_date, home_id)
  VALUES
  ($1, $2, $3, $4, $5)
  RETURNING *`,
        [
          newItem.item_name,
          newItem.item_price,
          newItem.purchase_date,
          newItem.expiry_date,
          home_id
        ]
      )
      .then(({ rows }) => {
        return rows[0];
      });
}


