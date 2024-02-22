import {
  fetchExpiries,
  fetchExpiriesByItemName,
} from "../models/expiries.model";

export function getExpiries(req, res, next) {
  fetchExpiries()
    .then((expiries) => {
      res.status(200).send({ expiries });
    })
    .catch((err) => {
      next(err);
    });
}


export function getExpiriesByItemName(req, res, next) {

    const { item_name } = req.params;

  fetchExpiriesByItemName(item_name)
    .then((expiry) => {
      res.status(200).send({ expiry });
    })
    .catch((err) => {
      next(err);
    });
}
