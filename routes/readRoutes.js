module.exports = function (app, gestorS, namespaces, url) {
  app.get('/symmetry/allergy/:id', async function (req, res) {
    let path = url + req.params.id

    let resp = await gestorS.leer(path)
    if (resp == null) {
      res.status(500)
      res.json({
        error: 'An error took place during the operation.'
      })
    } else {
      if (resp) {
        res.status(200)
      } else {
        res.status(404)
      }
      res.send(resp)
    }
  })
}
