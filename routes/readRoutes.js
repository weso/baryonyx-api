module.exports = function (app, gestorS, namespaces) {
  app.get('/symmetry/allergy/:id', async function (req, res) {
    let predicado = 'SELECT * { ?id a <' + namespaces.schema + 'MedicalContraindication>;' +
      '<' + namespaces.schema + 'description> ?descripcion;' +
      '<' + namespaces.schema + 'identifier> ?propietario;' +
      '<' + namespaces.schema + 'name> ?nombre. }'
    let url = 'https://oth2.solid.community/symmetry/' + req.params.id // Temporal, luego será un symmetry.localhost/...

    let resp = await gestorS.leer(url, predicado)
    if (resp == null) {
      res.status(500)
      res.json({
        error: 'An error took place during the operation.'
      })
    } else {
      if (resp) {
        res.status(200)
      }
      else {
        res.status(404)
      }
      res.send(resp)
    }
  })
}
