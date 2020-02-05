module.exports = {
  app: null,
  Q: null,
  fetch: null,
  newEngine: null,
  rdfjsSource: null,
  fileClient: null,
  init: function (app, Q, fetch, newEngine, rdfjsSource, fileClient) {
    this.app = app
    this.Q = Q
    this.fetch = fetch
    this.newEngine = newEngine
    this.rdfjsSource = rdfjsSource
    this.fileClient = fileClient
  },
  leer: async function (url, pred) {
    let path = url + '/Alergias.ttl'
    if (!(await this.existFolder(url))) {
      await this.fileClient.createFolder(url)
      await this.fileClient.createFile(path, '', 'text/turtle')
    }
    const deferred = this.Q.defer()
    const rdfjsSource = await this.rdfjsSource.fromUrl(path, this.fetch)
    if (rdfjsSource) {
      const engine = this.newEngine()
      const objects = []
      const promises = []
      const self = this
      engine.query(pred, {
        sources: [{
          type: 'rdfjsSource',
          value: rdfjsSource
        }]
      })
        .then(function (result) {
          result.bindingsStream.on('data', async (data) => {
            const deferred = self.Q.defer()
            promises.push(deferred.promise)
            data = data.toObject()
            objects.push(data)
            deferred.resolve()
          })

          result.bindingsStream.on('end', function () {
            self.Q.all(promises).then(() => {
              deferred.resolve(objects)
            })
          })
        })
    } else {
      deferred.resolve(null)
    }

    return deferred.promise
  },
  existFolder: async function (folderName) {
    if ((await this.fileClient.itemExists(folderName))) {
      return true
    } else {
      return false
    }
  },
  writeInFolder: async function (url, contenido, predicadoins, predicadobusq) {
    let path = url + '/Alergias.ttl'
    // create id folder if it does not exist
    if (!(await this.existFolder(url))) {
      await this.fileClient.createFolder(url)
      await this.fileClient.createFile(path, '', 'text/turtle')
    }
    // create allergy file
    for (var i = 0; i < contenido.name.length; i++) {
      let resp = await this.leer(url, predicadobusq)
      let nombre, desc, prop
      for (var j = 0; j < resp.length; j++) {
        if (resp[j]['?id'].id.split('Alergias.ttl#')[1] === contenido.idal[i]) {
          nombre = resp[j]['?nombre'].value.split('/')[5]
          desc = resp[j]['?descripcion'].value.split('/')[5]
          prop = resp[j]['?propietario'].value.split('/')[5]
          break
        }
      }

      await this.executeSPARQLUpdate(path, 'DELETE DATA { <#' + contenido.idal[i] +
        '> a <http://schema.org/MedicalContraindication>;' +
        '<http://schema.org/description> <' + desc + '>;' +
        '<http://schema.org/identifier> <' + prop + '>;' +
        '<http://schema.org/name> <' + nombre + '>.}')
    }
    await this.executeSPARQLUpdate(path, 'INSERT DATA {' + predicadoins + '}')
  },
  executeSPARQLUpdate: function (url, query) {
    console.log('borrando')
    return this.fetch(url, {
      method: 'PATCH',
      body: query,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    })
  },
  deleteAllergyFile: async function (symmetryPathWithID, webid) {
    var alrgyPath = symmetryPathWithID + '/Alergias.ttl'
    // checks if folder and file exists
    var url = webid.replace('profile/card#me', symmetryPathWithID)
    if (!(await this.existFolder(url))) {
      return false
    } else {
      if (!(await this.fileClient.itemExists(alrgyPath))) {
        return false
      } else {
        // deleting allergy file
        await this.fileClient.deleteFile(alrgyPath)
        return true
      }
    }
  },
  deleteUserFolder: async function (symmetryPathWithID, webid) {
    // checks if folder and file exists
    var url = webid.replace('profile/card#me', symmetryPathWithID)
    if (!(await this.existFolder(url))) {
      return false
    } else {
      if (!(await this.fileClient.itemExists(symmetryPathWithID))) {
        return false
      } else {
        // deleting user folder
        await this.fileClient.deleteFile(symmetryPathWithID)
        return true
      }
    }
  },
  updateAllergy: async function (url, contenido, predicadoins, predicadobusq) {
    let path = url + '/Alergias.ttl'
    // create id folder if it does not exist
    if (!(await this.existFolder(url))) {
      return false
    }
    // create allergy file
    let resp = await this.leer(url, predicadobusq)
    let nombre, desc, prop
    for (var j = 0; j < resp.length; j++) {
      if (resp[j]['?id'].id.split('Alergias.ttl#')[1] === contenido.idal) {
        console.log('ok')
        nombre = resp[j]['?nombre'].value.split('/')[5]
        desc = resp[j]['?descripcion'].value.split('/')[5]
        prop = resp[j]['?propietario'].value.split('/')[5]
        break
      }
    }
    // deleting previous allergy
    await this.executeSPARQLUpdate(path, 'DELETE DATA { <#' + contenido.idal +
      '> a <http://schema.org/MedicalContraindication>;' +
      '<http://schema.org/description> <' + desc + '>;' +
      '<http://schema.org/identifier> <' + prop + '>;' +
      '<http://schema.org/name> <' + nombre + '>.}')
    // adding updated allergy
    await this.executeSPARQLUpdate(path, 'INSERT DATA {' + predicadoins + '}')
    return true
  }
}
