module.exports = function (app, gestorS, namespaces) {
  app.post('/symmetry/write', function (req, res) {
    var contenido = {
      idcl: req.body.idcl,
      idal: req.body.idal,
      allergy: req.body.allergy,
      description: req.body.description
    }
    let predicado = ''
    let predicado2 = 'SELECT * { ?id a <' + namespaces.schema + 'MedicalContraindication>;' +
      '<' + namespaces.schema + 'description> ?descripcion;' +
      '<' + namespaces.schema + 'name> ?nombre. }'
    for (var i = 0; i < contenido.allergy.length; i++) {
      // allergies and description without spaces
      var descriptionNoSpace = contenido.description[i].split(' ').join('U0020')
      var allergyNoSpace = contenido.allergy[i].split(' ').join('U0020')
      // content to be inserted in the pod
      predicado += '\n<#' + contenido.idal[i] + '> a <' + namespaces.schema + 'MedicalContraindication>;' +
        '<' + namespaces.schema + 'description> <' + descriptionNoSpace + '>;' +
        '<' + namespaces.schema + 'name> <' + allergyNoSpace + '>.'
    }
    let path = 'https://takumi.solid.community/symmetry/' + req.body.idcl // Cambiar por NSS
    // gestorS.writeInFolder(path, contenido).then(result => {
    gestorS.writeInFolder2(path, contenido, predicado, predicado2).then(result => {
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
