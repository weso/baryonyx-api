module.exports = {
  app: null,
  Q: null,
  fetch: null,
  newEngine: null,
  rdfjsSource: null,
  init: function (app, Q, fetch, newEngine, rdfjsSource) {
    this.app = app
    this.Q = Q
    this.fetch = fetch
    this.newEngine = newEngine
    this.rdfjsSource = rdfjsSource
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
  }
}
