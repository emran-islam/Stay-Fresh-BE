import express from "express";
import { getEndpoints } from "./controllers/api.controller";
import { getItems, patchItemById } from "./controllers/items.controller";
import {
  handleInvalidEndpoint,
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} from "./errors";
import {
  getHomes,
  getItemsByHomeId,
  postItemByHomeId,
} from "./controllers/homes.controller";

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/items", getItems);
app.get("/api/homes", getHomes);
app.get("/api/homes/:home_id/items", getItemsByHomeId);
app.post("/api/homes/:home_id/items", postItemByHomeId);
app.patch("/api/items/:item_id", patchItemById)


app.all("/*", handleInvalidEndpoint);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

export default app;
