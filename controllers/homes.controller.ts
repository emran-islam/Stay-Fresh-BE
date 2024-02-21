import { fetchHomes, fetchItemsByHomeId } from "../models/homes.model";

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

  const homeExistenceQuery = checkExistsInDB("homes", "home_id", home_id);

  const fetchItemsByHomeQuery = fetchItemsByHomeId(home_id);

  Promise.all([fetchItemsByHomeQuery, homeExistenceQuery])
    .then((response) => {
      res.status(200).send({ items: response[0] });
    })
    .catch((err) => {
      next(err);
    });
}