import { fetchItems, updateItembyId } from "../models/items.model";


export function getItems(req, res, next) {
  fetchItems()
    .then((items) => {
      res.status(200).send({ items });
    })
    .catch((err) => {
      next(err);
    });
}

export function patchItemById(req, res, next) {
  const { item_id } = req.params;
  const updateItem = req.body;
  
  updateItembyId(item_id, updateItem).then((item) => {
    res.status(200).send({ item });
  });
}
