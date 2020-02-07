module.exports = function (app, gestorS, namespaces, url) {
  app.get('/symmetry/allergy/:id', async function (req, res) {
    let predicado = 'SELECT * { ?id a <' + namespaces.schema + 'MedicalContraindication>;' +
      '<' + namespaces.schema + 'description> ?descripcion;' +
      '<' + namespaces.schema + 'identifier> ?propietario;' +
      '<' + namespaces.schema + 'name> ?nombre. }'
    let path = url + req.params.id

    let resp = await gestorS.leer(path, predicado)
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
