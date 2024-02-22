import { fetchExpiries } from "../models/expiries.model";

export function getExpiries(req, res, next) {
  fetchExpiries()
    .then((expiries) => {
      res.status(200).send({ expiries });
    })
    .catch((err) => {
      next(err);
    });
}
