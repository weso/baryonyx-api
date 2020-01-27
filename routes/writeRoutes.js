module.exports = function (app, gestorS) {
  app.get('/symmetry/write/:id/:allergy/:description', function (req, res) {
    var url = 'https://oth2.solid.community/profile/card#me' // TODO: change later
    var contenido = {
      id: req.params.id,
      allergy: req.params.allergy,
      description: req.params.description
    }
    gestorS.writeInFolder('symmetry/' + contenido.id, url, contenido.allergy, contenido.description).then(result => {
      console.log(result)
    }).catch(error => {
      console.log(error)
    })
  })
}
