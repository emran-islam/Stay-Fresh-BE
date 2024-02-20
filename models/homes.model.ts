import db from "../db/connection";

export function fetchHomes() {
  return db.query(`SELECT * FROM homes`).then((result) => {
    return result.rows;
  });
}
