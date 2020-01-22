var appRouter = function (app) {
  app.get('/welcome', function (req, res) {
    res.status(200).send('This is the baryonyx api!')
  })
}

module.exports = appRouter
