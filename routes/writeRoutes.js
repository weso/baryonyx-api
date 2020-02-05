module.exports = function (app, gestorS, namespaces) {
  app.post('/symmetry/write', function (req, res) {
    var contenido = {
      idcl: req.body.idcl, // ID paciente
      idal: req.body.idal, // ID alergia
      idpr: req.body.idpr, // ID propietario
      name: req.body.name, // Nombre alergia
      description: req.body.description // Observaciones
    }

    let predicado = ''
    let predicado2 = 'SELECT * { ?id a <' + namespaces.schema + 'MedicalContraindication>;' +
      '<' + namespaces.schema + 'description> ?descripcion;' +
      '<' + namespaces.schema + 'identifier> ?propietario;' +
      '<' + namespaces.schema + 'name> ?nombre. }'

    for (let i = 0; i < contenido.name.length; i++) {
      // allergies and description without spaces
      let descriptionNoSpace = contenido.description[i].split(' ').join('U0020')
      let nameNoSpace = contenido.name[i].split(' ').join('U0020')
      // content to be inserted in the pod
      predicado += '\n<#' + contenido.idal[i] + '> a <' + namespaces.schema + 'MedicalContraindication>;' +
        '<' + namespaces.schema + 'description> <' + descriptionNoSpace + '>;' +
        '<' + namespaces.schema + 'identifier> <' + contenido.idpr[i] + '>;' +
        '<' + namespaces.schema + 'name> <' + nameNoSpace + '>.'
    }
    let path = 'https://oth2.solid.community/symmetry/' + req.body.idcl // Cambiar por NSS

    gestorS.writeInFolder(path, contenido, predicado, predicado2).then(result => {
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
        res.status(200).json({
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
        res.status(200).json({
          message: 'Carpeta del usuario ' + id + ' Borrada!'
        })
      } else {
        res.status(500).json({
          error: 'Carpeta del usuario ' + id + ' NO existe!'
        })
      }
    })
  })

  app.post('/symmetry/update', function (req, res) {
    var contenido = {
      idcl: req.body.idcl, // ID paciente
      idal: req.body.idal, // ID alergia
      idpr: req.body.idpr, // ID propietario
      name: req.body.name, // Nombre alergia
      description: req.body.description // Observaciones
    }

    let predicado2 = 'SELECT * { ?id a <' + namespaces.schema + 'MedicalContraindication>;' +
      '<' + namespaces.schema + 'description> ?descripcion;' +
      '<' + namespaces.schema + 'identifier> ?propietario;' +
      '<' + namespaces.schema + 'name> ?nombre. }'

    // allergies and description without spaces
    let descr = contenido.description + ''
    let nombre = contenido.name + ''
    let descriptionNoSpace = descr.split(' ').join('U0020')
    let nameNoSpace = nombre.split(' ').join('U0020')
    // content to be inserted in the pod
    let predicado = '\n<#' + contenido.idal + '> a <' + namespaces.schema + 'MedicalContraindication>;' +
      '<' + namespaces.schema + 'description> <' + descriptionNoSpace + '>;' +
      '<' + namespaces.schema + 'identifier> <' + contenido.idpr + '>;' +
      '<' + namespaces.schema + 'name> <' + nameNoSpace + '>.'

    let path = 'https://oth2.solid.community/symmetry/' + contenido.idcl // Cambiar por NSS

    gestorS.updateAllergy(path, contenido, predicado, predicado2).then(result => {
      if (result === true) {
        res.status(200).json({
          message: 'Alergia Actualizada!'
        })
      } else {
        res.status(400).json({
          error: 'Alergia NO Actualizada!'
        })
      }
    })
  })
}
