module.exports = function (app, gestorS, namespaces) {
  app.get('/symmetry/alergias/:id', async function (req, res) {
    let predicado = 'SELECT * { ?id a <' + namespaces.schema + 'MedicalContraindication>;' +
      '<' + namespaces.schema + 'description> ?descripcion;' +
      '<' + namespaces.schema + 'name> ?nombre. }'
    let url = 'https://takumi.solid.community/symmetry/' + req.params.id + '/Alergias.ttl' // Temporal, luego será un symmetry.localhost/...

    let resp = await gestorS.leer(url, predicado)
    if (resp == null) {
      res.status(500)
      res.json({
        error: 'se ha producido un error'
      })
    } else {
      res.status(200)
      res.send(resp)
    }
  })
}
