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
  writeInFolder: async function (folderName, webid, allergy, description) {
    // uniq id for the allergy
    var uniqid = require('uniqid')
    // create id folder if it does not exist
    if (!(await this.existFolder(folderName, webid))) {
      await this.fileClient.createFolder(folderName)
      console.log('folder ' + folderName + ' created !')
    } else {
      console.log('folder ' + folderName + ' already exists !')
    }
    // allergies and description without spaces
    var descriptionNoSpace = description.split(' ').join('U0020')
    var allergyNoSpace = allergy.split(' ').join('U0020')
    // content to be inserted in the pod
    let content = '@prefix schem: <http://schema.org/>.\n'
    let allergyContent = '\n<#' + uniqid() + '> a schem:MedicalContraindication;' +
      '\nschem:description <' + descriptionNoSpace + '>;' +
      '\nschem:name <' + allergyNoSpace + '>.'
    // create allergy folder
    await this.fileClient.createFile(folderName + '/Alergias.ttl', content + allergyContent, 'text/turtle')
  }
}
