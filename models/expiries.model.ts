import db from "../db/connection";

export function fetchExpiries() {
  return db.query(`SELECT * FROM expiries`).then((result) => {
    return result.rows;
  });
}
