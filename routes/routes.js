var appRouter = function (app) {
  app.get("/", function(req, res) {
    res.status(200).send("This is the bayronyx api!");
  });
}

module.exports = appRouter;
