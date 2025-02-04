module.exports = function (app, gestorS, url) {
  app.delete('/symmetry/file/allergy/:id', function (req, res) {
    var id = req.params.id
    var path = url + id
    gestorS.deleteAllergyFile(path).then(result => {
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

  app.delete('/symmetry/user/:id', function (req, res) {
    var id = req.params.id
    var path = url + id
    gestorS.deleteUserFolder(path).then(result => {
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

  app.delete('/symmetry/allergy/:idcl/:idal', function (req, res) {
    var contenido = {
      idcl: req.params.idcl,
      idal: req.params.idal // ID alergia
    }

    let path = url + contenido.idcl

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
