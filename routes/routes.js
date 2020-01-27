module.exports = function (app, gestorS, namespaces) {
  app.get('/symmetry', async function (req, res) {
    let predicado = 'SELECT * { ?id a <' + namespaces.schema + 'MedicalContraindication>;' +
      '<' + namespaces.schema + 'description> ?descripcion;' +
      '<' + namespaces.schema + 'name> ?nombre. }'
    let url = 'https://takumi.solid.community/public/wo.ttl'

    let resp = await gestorS.leer(url, predicado)
    if (resp == null) {
      res.status(500)
      res.json({
        error: 'se ha producido un error'
      })
    } else {
      res.status(200)
      res.send(JSON.stringify(resp))
    }
  })

  app.post('/symmetry', function (req, res) {
    var contenido = {
      a: req.body.a,
      b: req.body.b,
      c: req.body.c
    }
  })
}
