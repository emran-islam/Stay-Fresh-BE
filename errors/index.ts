export function handleInvalidEndpoint(req, res, next) {
  res.status(404).send({ msg: "Not Found - Invalid Endpoint" });
}

export function handleServerErrors(err, req, res, next) {
  res.status(500).send({ msg: "Unknown Error" });
}

export function handleCustomErrors(err, req, res, next) {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

export function handlePsqlErrors(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
}
