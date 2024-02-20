import {fetchEndPoints} from "../models/api.model"


export function getEndpoints(req, res, next) {
    const endPoints = fetchEndPoints()
    res.status(200).send(endPoints)
    }