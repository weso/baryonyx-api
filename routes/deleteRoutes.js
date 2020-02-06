module.exports = function (app, gestorS) {
  app.delete('/symmetry/file/allergy', function (req, res) {
    var url = 'https://oth2.solid.community/' // TODO: change later
    var id = req.body.id
    var path = url + 'symmetry/' + id
    gestorS.deleteAllergyFile(path, url).then(result => {
      if (result) {
        res.status(200).json({
          message: 'The Allergy file has been deleted.'
        })
      } else if (!result) {
        res.status(404).json({
          error: 'The Allergy file does not exist or could not be found.'
        })
      } else { // No response was given due to failure in SOLID file functions
        res.status(500).json({
          error: 'The Allergy file could not be deleted.'
        })
      }
    })
  })

  app.delete('/symmetry/user', function (req, res) {
    var url = 'https://oth2.solid.community/' // TODO: change later
    var id = req.body.id
    var path = url + 'symmetry/' + id
    gestorS.deleteUserFolder(path, url).then(result => {
      if (result) {
        res.status(200).json({
          message: 'User ' + id + ' folder has been deleted.'
        })
      } else if (!result) {
        res.status(404).json({
          error: 'User ' + id + ' folder does not exist or could not be found.'
        })
      } else { // No response was given due to failure in SOLID file functions
        res.status(500).json({
          error: 'User ' + id + ' folder could not be deleted.'
        })
      }
    })
  })

  app.delete('/symmetry/allergy', function (req, res) {
    var contenido = {
      idcl: req.body.idcl,
      idal: req.body.idal // ID alergia
    }

    let path = 'https://oth2.solid.community/symmetry/' + contenido.idcl // TODO: change later

    gestorS.deleteAllergy(path, contenido).then(result => {
      if (result) {
        res.status(200).json({
          message: 'Allergy ' + contenido.idal + ' has been successfully deleted.'
        })
      } else if (!result) {
        res.status(404).json({
          error: 'Either user ' + contenido.idcl + ' could not be found, or the allergy ' + contenido.idal + ' could not be found.'
        })
      } else { // No response was given due to failure in SOLID file functions
        res.status(500).json({
          error: 'Allergy ' + contenido.idal + ' could not be deleted.'
        })
      }
    })
  })
}
