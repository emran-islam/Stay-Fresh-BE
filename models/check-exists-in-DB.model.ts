import db from "../db/connection";
import format from "pg-format";

export function checkExistsInDB (table, column, value){
    const lookup = {homes:"home"}
    const queryString = format("SELECT * FROM %I WHERE %I = $1", table, column)

    return db.query(queryString, [value]).then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({status:"404", msg:`${lookup[table]} does not exist`})
        }
    })
}
