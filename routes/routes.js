module.exports = function (app, gestorS) {
  app.get('/symmetry', function (req, res) {
    // var criterio = {"_id": }
    var url = ''
    var pred = ''

    gestorS.leer(url, pred)
  })

  app.post('/symmetry', function (req, res) {
    var contenido = {
      a: req.body.a,
      b: req.body.b,
      c: req.body.c
    }
  })
}
