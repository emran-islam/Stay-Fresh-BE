import express from "express";
import cors from "cors";
import { getEndpoints } from "./controllers/api.controller";
import {
  getItems,
  patchItemById,
  deleteItemById,
} from "./controllers/items.controller";
import { getUsers, postUser } from "./controllers/users.controllers";
import {
  getExpiries,
  getExpiriesByItemName,
} from "./controllers/expiries.controller";
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
app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/items", getItems);
app.get("/api/homes", getHomes);
app.get("/api/users", getUsers);

app.get("/api/expiries", getExpiries);
app.get("/api/expiries/:item_name", getExpiriesByItemName);
app.get("/api/homes/:home_id/items", getItemsByHomeId);

app.post("/api/homes/:home_id/items", postItemByHomeId);
app.post("/api/users", postUser);


app.patch("/api/items/:item_id", patchItemById);

app.delete("/api/items/:item_id", deleteItemById);

app.all("/*", handleInvalidEndpoint);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

export default app;
