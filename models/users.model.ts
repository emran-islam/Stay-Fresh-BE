import db from "../db/connection";

export function fetchUsers() {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
}

export function addUser(newUser) {
      return db
        .query(
          `
  INSERT INTO users
  (user_name, home_id)
  VALUES
  ($1, $2)
  RETURNING *`,
          [
            newUser.user_name,
            newUser.home_id
          ]
        )
        .then(({ rows }) => {
          return rows[0];
        });

}