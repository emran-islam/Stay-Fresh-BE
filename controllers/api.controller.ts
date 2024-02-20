import fetchEndPoints from "../models/api.model"


exports.getEndpoints = ( req, res, next) => {
    const endPoints = fetchEndPoints()
    res.status(200).send(endPoints)
    }