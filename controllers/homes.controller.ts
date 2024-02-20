import { fetchHomes } from "../models/homes.model";

export function getHomes(req, res, next) {
  fetchHomes().then((homes) => {
    res.status(200).send({ homes });
  }).catch((err)=>{
    next(err)
  });
}
