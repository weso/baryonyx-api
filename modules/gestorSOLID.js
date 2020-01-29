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
  writeInFolder: async function (url, contenido, namespaces) {
    // create id folder if it does not exist
    if (!(await this.existFolder(url))) {
      await this.fileClient.createFolder(url)
    }
    // header for allergy.ttl
    let content = '@prefix schem: <http://schema.org/>.\n'
    let allergyContent = ''
    // foreach allergy
    for (var i = 0; i < contenido.allergy.length; i++) {
      // allergies and description without spaces
      var descriptionNoSpace = contenido.description[i].split(' ').join('U0020')
      var allergyNoSpace = contenido.allergy[i].split(' ').join('U0020')
      // content to be inserted in the pod
      allergyContent += '\n<#' + contenido.idal[i] + '> a schem:MedicalContraindication;' +
        '\nschem:description <' + descriptionNoSpace + '>;' +
        '\nschem:name <' + allergyNoSpace + '>.'
    }
    // create allergy file
    await this.fileClient.createFile(url + '/Alergias.ttl', content + allergyContent, 'text/turtle')
  },
  writeInFolder2: async function (url, contenido, predicadoins, predicadobusq) {
    let path = url + '/Alergias.ttl'
    // create id folder if it does not exist
    if (!(await this.existFolder(url))) {
      await this.fileClient.createFolder(url)
      await this.fileClient.createFile(path, '', 'text/turtle')
    }
    // create allergy file
    for (var i = 0; i < contenido.allergy.length; i++) {
      let resp = await this.leer(url, predicadobusq)
      let nombre, desc
      for (var j = 0; j < resp.length; j++) {
        if (resp[j]['?id'].id.split('Alergias.ttl#')[1] === contenido.idal[i]) {
          nombre = resp[j]['?nombre'].value.split('/')[5]
          desc = resp[j]['?descripcion'].value.split('/')[5]
          break
        }
      }

      await this.executeSPARQLUpdate(path, 'DELETE DATA { <#' + contenido.idal[i] +
        '> a <http://schema.org/MedicalContraindication>;' +
        '<http://schema.org/description> <' + desc + '>;' +
        '<http://schema.org/name> <' + nombre + '>.}')
    }
    await this.executeSPARQLUpdate(path, 'INSERT DATA {' + predicadoins + '}')
  },
  executeSPARQLUpdate: function (url, query) {
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
  }
}
