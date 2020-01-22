var appRouter = function (app) {
  app.get("/testing", function(req, res) {
    res.status(200).send("This is the baryonyx api!");
  });
}

module.exports = appRouter;
