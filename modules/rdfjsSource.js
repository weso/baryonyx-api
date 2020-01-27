module.exports = {
  N3: null,
  Q: null,
  init: function (N3, Q) {
    this.N3 = N3
    this.Q = Q
  },
  fromUrl: async function (url, fetch) {
    const deferred = this.Q.defer()
    fetch(url)
      .then(async res => {
        if (res.status === 404) {
          deferred.reject(404)
        } else {
          const body = await res.text()
          const store = this.N3.Store()
          const parser = this.N3.Parser({
            baseIRI: res.url
          })
          parser.parse(body, (err, quad, prefixes) => {
            if (err) {
              console.log(err)
              deferred.reject()
            } else if (quad) {
              store.addQuad(quad)
            } else {
              const source = {
                match: function (s, p, o, g) {
                  return require('streamify-array')(store.getQuads(s, p, o, g))
                }
              }
              deferred.resolve(source)
            }
          })
        }
      }).catch(reason => {
        console.warn('No RDFJSSource was created for' + url + '. File already deleted?')
        deferred.resolve(null)
      })

    return deferred.promise
  }
}
