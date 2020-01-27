module.exports = function (app, gestorS) {
  app.get('/symmetry/write/:id/:allergies', function (req, res) {
    var url = 'https://oth2.solid.community/profile/card#me'
    var contenido = {
      id: req.params.id,
      allergies: req.params.allergies
    }
    gestorS.existFolder('symmetry/' + contenido.id, url).then(result => {
      if (result === true) {
        console.log('file already exists')
      } else {
        console.log('file does not exist!')
      }
    }).catch(error => {
      console.log(error)
    })
  })
}
