import {
  fetchHomes,
  fetchItemsByHomeId,
  addItemByHomeId,
  addHome,
} from "../models/homes.model";

import { checkExistsInDB } from "../models/check-exists-in-DB.model";

export function getHomes(req, res, next) {
  fetchHomes()
    .then((homes) => {
      res.status(200).send({ homes });
    })
    .catch((err) => {
      next(err);
    });
}

export function getItemsByHomeId(req, res, next) {
  const { home_id } = req.params;
  const statusQuery = req.query.item_status;

  const homeExistenceQuery = checkExistsInDB("homes", "home_id", home_id);

  const fetchItemsByHomeQuery = fetchItemsByHomeId(home_id, statusQuery);

  Promise.all([fetchItemsByHomeQuery, homeExistenceQuery])
    .then((response) => {
      res.status(200).send({ items: response[0] });
    })
    .catch((err) => {
      next(err);
    });
}

export function postItemByHomeId(req, res, next) {
  const { home_id } = req.params;
  const newItem = req.body;

  const homeExistenceQuery = checkExistsInDB("homes", "home_id", home_id);

  const addItemByHomeIdQuery = addItemByHomeId(newItem, home_id);

  Promise.all([addItemByHomeIdQuery, homeExistenceQuery])
    .then((response) => {
      res.status(201).send({ item: response[0] });
    })
    .catch((err) => {
      next(err);
    });
}

export function postHome(req, res, next) {
  const newHome = req.body;
  addHome(newHome)
    .then((home) => {
      console.log(home);

      res.status(201).send({ home });
    })
    .catch((err) => {
      next(err);
    });
}
