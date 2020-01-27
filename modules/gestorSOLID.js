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
  }
}
