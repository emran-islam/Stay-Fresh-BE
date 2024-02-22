import { fetchUsers, addUser } from "../models/users.model";
import { checkExistsInDB } from "../models/check-exists-in-DB.model";

export function getUsers(req, res, next) {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
}


export function postUser(req, res, next) {

    const newUser = req.body;
    const home_id = req.body.home_id

    const homeExistenceQuery = checkExistsInDB("homes", "home_id", home_id);

    const addUserQuery = addUser(newUser);

  Promise.all([addUserQuery, homeExistenceQuery])
    .then((response) => {
      res.status(201).send({ user: response[0] });
    })
    .catch((err) => {
      next(err);
    });
}