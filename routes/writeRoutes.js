module.exports = function (app, gestorS) {
  app.post('/symmetry/write', function (req, res) {
    var url = 'https://takumi.solid.community/' // TODO: change later
    var contenido = {
      id: req.body.id,
      allergy: req.body.allergy,
      description: req.body.description
    }
    var path = url + 'symmetry/' + contenido.id
    gestorS.writeInFolder(path, url, contenido.allergy, contenido.description).then(result => {
      res.status(201).json({
        message: 'Alergia Insertada'
      })
    }).catch(error => {
      res.status(500).json({
        error: 'Alergia No Insertada\n' + error
      })
    })
  })

  app.post('/symmetry/delete', function (req, res) {
    var url = 'https://oth2.solid.community/' // TODO: change later
    var id = req.body.id
    var path = url + 'symmetry/' + id
    gestorS.deleteAllergyFile(path, url).then(result => {
      if (result === true) {
        res.status(201).json({
          message: 'Fichero de Alergias Borrado!'
        })
      } else {
        res.status(500).json({
          error: 'Fichero de Alergias NO Borrado o NO existe!'
        })
      }
    })
  })

  app.post('/symmetry/user/delete', function (req, res) {
    var url = 'https://oth2.solid.community/' // TODO: change later
    var id = req.body.id
    var path = url + 'symmetry/' + id
    gestorS.deleteUserFolder(path, url).then(result => {
      if (result === true) {
        res.status(201).json({
          message: 'Carpeta del usuario ' + id + ' Borrada!'
        })
      } else {
        res.status(500).json({
          error: 'Carpeta del usuario ' + id + ' NO existe!'
        })
      }
    })
  })
}
