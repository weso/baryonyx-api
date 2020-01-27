module.exports = function (app, gestorS) {
  app.get('/symmetry/write/:id/:allergies', function (req, res) {
    var url = 'https://oth2.solid.community/profile/card#me'
    var contenido = {
      id: req.params.id,
      allergies: req.params.allergies
    }
    gestorS.writeInFolder('symmetry/' + contenido.id, url, contenido.allergies).then(result => {
      console.log(result)
    }).catch(error => {
      console.log(error)
    })
  })
}
