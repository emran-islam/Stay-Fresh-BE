import db from "../db/connection";


export function fetchItems() {
    return db.query(`SELECT * FROM items`).then((result)=>{
        return result.rows
    })
}
