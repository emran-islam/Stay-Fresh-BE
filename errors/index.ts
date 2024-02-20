
export function handleInvalidEndpoint(req, res, next){
      res.status(404).send({ msg: "Not Found - Invalid Endpoint" });
}

export function handleServerErrors(err, req, res, next) {
  res.status(500).send({ msg: "Unknown Error" });
};