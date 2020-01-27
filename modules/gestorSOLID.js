module.exports = {
  app: null,
  Q: null,
  fetch: null,
  newEngine: null,
  rdfjsSource: null,
  fileClient: null,
  namespaces: null,
  init: function (app, Q, fetch, newEngine, rdfjsSource, fileClient, namespaces) {
    this.app = app
    this.Q = Q
    this.fetch = fetch
    this.newEngine = newEngine
    this.rdfjsSource = rdfjsSource
    this.fileClient = fileClient
    this.namespaces = namespaces
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
  writeInFolder: async function (folderName, webid, allergies) {
    var url = webid.replace('profile/card#me', folderName)
    // create id folder if it does not exist
    if (!(await this.existFolder(folderName, webid))) {
      await this.fileClient.createFolder(url)
      console.log('folder ' + url + ' created !')
    } else {
      console.log('folder ' + url + ' already exists !')
    }
    if (!(await this.fileClient.itemExists(url + '/Alergias.ttl'))) {
      await this.fileClient.createFile(url + '/Alergias.ttl', '', 'text/turtle')
      console.log('folder Alergias.ttl created !')
    } else {
      console.log('folder Alergias.ttl already exists !')
    }
  }
}
