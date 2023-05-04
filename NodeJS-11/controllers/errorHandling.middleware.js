function handleError(err, req, res, next) {
  console.log("ErrorHandling Middleware");
  console.log(err);
  res.status(err.statusCode || 500).send(err.message);
}
export default handleError;
