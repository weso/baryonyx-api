module.exports = function (app, gestorS) {
  app.post('/symmetry/write', function (req, res) {
    var url = 'https://oth2.solid.community/profile/card#me' // TODO: change later
    var contenido = {
      id: req.body.id,
      allergy: req.body.name,
      description: req.body.description
    }
    gestorS.writeInFolder('symmetry/' + contenido.id, url, contenido.allergy, contenido.description).then(result => {
      console.log(result)
    }).catch(error => {
      console.log(error)
    })
  })
}
