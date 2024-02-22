import {
  fetchItems,
  updateItembyId,
  removeItemById,
} from "../models/items.model";
import { checkExistsInDB } from "../models/check-exists-in-DB.model";



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
  
    const itemExistenceQuery = checkExistsInDB("items", "item_id", item_id)

    const updateItemsByIdQuery = updateItembyId(item_id, updateItem);

  
  Promise.all([updateItemsByIdQuery, itemExistenceQuery])
    .then((response) => {
      res.status(200).send({ item: response[0]});
    })
    .catch((err) => {
      next(err);
    });
}


export function deleteItemById(req, res, next) {

    const { item_id } = req.params;

  const itemExistenceQuery = checkExistsInDB("items", "item_id", item_id);

const removeItemByIdQuery = removeItemById(item_id);

  Promise.all([removeItemByIdQuery, itemExistenceQuery])
    .then((items) => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}
