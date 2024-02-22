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

  let slicedUpdateQuery = queryArray.length > 0 ? updateQuery.slice(0, -1) : updateQuery;

  slicedUpdateQuery += ` WHERE item_id = $${
    queryArray.length + 1
  } RETURNING *;`;

  queryArray.push(item_id);

  return db.query(slicedUpdateQuery, queryArray).then((result) => {
    return result.rows[0];
  });
}


export function removeItemById(item_id) {
  return db
    .query(`DELETE FROM items WHERE item_id = $1 RETURNING *;`, [item_id])
    .then((result) => {
      return result.rows;
    });
}
