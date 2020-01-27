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
  leer: async function (url, predicate) {
    const deferred = this.Q.defer()
    const rdfjsSource = await this.rdfjsSource.fromUrl(url, this.fetch)
    if (rdfjsSource) {
      const engine = this.newEngine()
      engine.query('SELECT ?o { <' + url + '> <' + predicate + '> ?o.}', {
        sources: [{
          type: 'rdfjsSource',
          value: rdfjsSource
        }]
      })
        .then(function (result) {
          result.bindingsStream.on('data', function (data) {
            data = data.toObject()

            deferred.resolve(data['?o'])
          })

          result.bindingsStream.on('end', function () {
            deferred.resolve(null)
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
      // await this.fileClient.createFolder(url)
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
    // creates allergy folder if does not exist
    if (!(await this.existFolder(folderName + '/Allergies', webid))) {
      await this.fileClient.createFolder(url)
      console.log('folder ' + url + ' created !')
    } else {
      console.log('folder ' + url + ' already exists !')
    }
  },
  storeAllergies: async function (userDataUrl, userWebId, time, allergy) {
    const allergyUrl = await this.generateUniqueUrlForResource(userDataUrl)

    const forAllergies = `
		<${allergyUrl}> a <${this.namespaces.schema}Message>;
		  <${this.namespaces.schema}dateSent> <${time}>;
		  <${this.namespaces.schema}text> <${allergy}>.`
    try {
      // await this.uploader.executeSPARQLUpdateForUser(userDataUrl, `INSERT DATA {${forAllergies}}`)
    } catch (e) {
      this.logger.error('Could not save new allergy.')
      this.logger.error(e)
    }
  },
  generateUniqueUrlForResource: async function (baseurl) {
    let url = baseurl + '#' + this.uniqid()
    return url
  }
}
