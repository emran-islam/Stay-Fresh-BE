import db from "../db/connection";
// import items from "../db/data/test-data/items";

export function fetchHomes() {
  return db.query(`SELECT * FROM homes`).then((result) => {
    return result.rows;
  });
}

export function fetchItemsByHomeId(home_id, statusQuery) {
  const validstatusQueries = [
    "ACTIVE",
    "active",
    "USED",
    "used",
    "TRASHED",
    "trashed",
  ];

  if (!validstatusQueries.includes(statusQuery) && statusQuery) {
    return Promise.reject({
      status: 400,
      msg: "invalid status query",
    });
  }

  let queryArray: any[] = [home_id];

  let fetchItemsQuery = "SELECT * FROM items WHERE home_id = $1";

  if (statusQuery) {
    fetchItemsQuery += ` AND item_status=$2`;
    queryArray.push(statusQuery);
  }
  fetchItemsQuery += ` ORDER BY expiry_date ASC;`;

  return db.query(fetchItemsQuery, queryArray).then((result) => {
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
        home_id,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}
