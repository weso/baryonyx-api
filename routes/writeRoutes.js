module.exports = function (app, gestorS) {
  app.post('/symmetry/allergy/write', function (req, res) {
    var contenido = {
      idcl: req.body.idcl, // ID paciente
      idal: req.body.idal, // ID alergia
      idpr: req.body.idpr, // ID propietario
      name: req.body.name, // Nombre alergia
      description: req.body.description // Observaciones
    }

    let path = 'https://oth2.solid.community/symmetry/' + req.body.idcl // Cambiar por NSS

    gestorS.writeInFolder(path, contenido).then(result => {
      if (result) {
        res.status(201).json({
          message: 'The allergy or allergies were successfully inserted on user ' + contenido.idcl + '\'s folder.'
        })
      } else if (!result) {
        res.status(201).json({
          message: 'No user was found with ID ' + contenido.idcl + '. Therefore, a folder was created for him. The allergy or allergies were successfully inserted.'
        })
      } else { // No response was given due to failure in SOLID file functions
        res.status(500).json({
          error: 'The allergy or allergies could not be inserted.'
        })
      }
    })
  })

  app.put('/symmetry/allergy/update', function (req, res) {
    var contenido = {
      idcl: req.body.idcl, // ID paciente
      idal: req.body.idal[0], // ID alergia
      idpr: req.body.idpr[0], // ID propietario
      name: req.body.name[0], // Nombre alergia
      description: req.body.description[0] // Observaciones
    }

    let path = 'https://oth2.solid.community/symmetry/' + contenido.idcl // Cambiar por NSS

    gestorS.updateAllergy(path, contenido).then(result => {
      if (result) {
        res.status(201).json({
          message: 'The allergy ' + contenido.idal + ' was successfully updated on user ' + contenido.idcl + '\'s folder.'
        })
      } else if (!result) {
        res.status(404).json({
          error: 'No user was found with ID ' + contenido.idcl + ' or allergy with ID ' + contenido.idal + ' could not be found.'
        })
      } else { // No response was given due to failure in SOLID file functions
        res.status(500).json({
          error: 'The allergy ' + contenido.idal + ' could not be updated.'
        })
      }
    })
  })
}
