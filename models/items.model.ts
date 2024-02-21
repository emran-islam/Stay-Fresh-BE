import db from "../db/connection";

export function fetchItems() {
  return db.query(`SELECT * FROM items`).then((result) => {
    return result.rows;
  });
}

export function updateItembyId(item_id, updateItem) {
  let updateQuery = "UPDATE items SET";
  let queryArray: any[] = [];

  for (const key in updateItem) {
    queryArray.push(updateItem[key]);
    updateQuery += ` ${key} = $${queryArray.length},`;
  }

  let slicedUpdateQuery = updateQuery.slice(0, -1);

  slicedUpdateQuery += ` WHERE item_id = $${
    queryArray.length + 1
  } RETURNING *;`;

  queryArray.push(item_id);

  return db.query(slicedUpdateQuery, queryArray).then((result) => {
    return result.rows[0];
  });
}
