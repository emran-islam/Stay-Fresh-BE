import db from "../db/connection";

export function fetchExpiries() {
  return db.query(`SELECT * FROM expiries`).then((result) => {
    return result.rows;
  });
}

export function fetchExpiriesByItemName(item_name) {

  const searchString = `%${item_name}%`

  return db
    .query(`SELECT * FROM expiries WHERE item_name ILIKE $1;`, [searchString])
    .then((result) => {

      if (result.rows.length === 0 ){
        return Promise.reject({
          status: 404,
          msg: `expiry item does not exist`,
        });
      }

      return result.rows[0];
    });
}
