module.exports = function (app, gestorS) {
  app.post('/symmetry/write', function (req, res) {
    var url = 'https://takumi.solid.community/' // TODO: change later
    var contenido = {
      id: req.body.id,
      allergy: req.body.allergy,
      description: req.body.description
    }
    gestorS.writeInFolder(url + 'symmetry/' + contenido.id, url, contenido.allergy, contenido.description).then(result => {
      res.status(201).send('Alergía Insertada')
    }).catch(error => {
      res.status(500).send('Alergia No Insertada\n' + error)
    })
  })
}
