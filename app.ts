import express from "express"
import { getEndpoints } from "./controllers/api.controller";
import { getItems } from "./controllers/items.controller";
import { handleInvalidEndpoint, handleServerErrors } from "./errors";
import { getHomes } from "./controllers/homes.controller";

const app = express()
app.use(express.json());


app.get("/api", getEndpoints)
app.get("/api/items", getItems);
app.get("/api/homes", getHomes);



app.all("/*", handleInvalidEndpoint);
app.use(handleServerErrors);


export default app