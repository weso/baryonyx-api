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
    const deferred = this.Q.defer()
    const rdfjsSource = await this.rdfjsSource.fromUrl(url, this.fetch)
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
  existFolder: async function (folderName, webid) {
    var url = webid.replace('profile/card#me', folderName)
    if ((await this.fileClient.itemExists(url))) {
      return true
    } else {
      return false
    }
  },
  writeInFolder: async function (symmetryPathWithID, webid, allergy, description) {
    // uniq id for the allergy
    var uniqid = require('uniqid')
    // create id folder if it does not exist
    if (!(await this.existFolder(symmetryPathWithID, webid))) {
      await this.fileClient.createFolder(symmetryPathWithID)
    }
    // header for allergy.ttl
    let content = '@prefix schem: <http://schema.org/>.\n'
    let allergyContent = ''
    // foreach allergy
    for (var i = 0; i < allergy.length; i++){
      // allergies and description without spaces
      var descriptionNoSpace = description[i].split(' ').join('U0020')
      var allergyNoSpace = allergy[i].split(' ').join('U0020')
      // content to be inserted in the pod
      allergyContent += '\n<#' + uniqid() + '> a schem:MedicalContraindication;' +
        '\nschem:description <' + descriptionNoSpace + '>;' +
        '\nschem:name <' + allergyNoSpace + '>.'
    }
    // create allergy folder
    await this.fileClient.createFile(symmetryPathWithID + '/Alergias.ttl', content + allergyContent, 'text/turtle')
  },
  deleteAllergyFile: async function (symmetryPathWithID, webid) {
    var alrgyPath = symmetryPathWithID + '/Alergias.ttl'
    // checks if folder and file exists
    if (!(await this.existFolder(symmetryPathWithID, webid))) {
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
    if (!(await this.existFolder(symmetryPathWithID, webid))) {
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
