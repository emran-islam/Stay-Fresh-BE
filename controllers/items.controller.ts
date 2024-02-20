import { fetchItems } from "../models/items.model"

export function getItems(req, res, next) {
    fetchItems()
      .then((items) => {
        res.status(200).send({ items });
      })
      .catch((err) => {
        next(err);
      });
}