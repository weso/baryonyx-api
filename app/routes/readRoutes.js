module.exports = function (app, gestorS, namespaces, url, fileClient) {

  app.get('/symmetry/allergy/:id', async function (req, res) {
    let folder = await fileClient.readFolder(url)
    let resp = null
    let found = false
    for (let i = 0; i < folder.folders.length; i++) {
      let id = folder.folders[i].name

      let path = url + id

      resp = await gestorS.leer(path, req.params.id)
      if (resp[0]) {
        res.status(200)
        res.send(resp)
        found = true
      }

    }
    if (resp == null) {
      res.status(500)
      res.json({
        error: 'An error took place during the operation.'
      })
    } else if (!found) {
      res.status(404)
      res.json({
        error: 'The allergy ' + req.params.id + ' could not be found.'
      })
    }
  })

  app.get('/symmetry/allergy/patient/:id', async function (req, res) {
    let path = url + req.params.id

    let resp = await gestorS.leer(path)
    if (resp == null) {
      res.status(500)
      res.json({
        error: 'An error took place during the operation.'
      })
    } else {
      if (resp) {
        res.status(200)
      } else {
        res.status(404)
      }
      res.send(resp)
    }
  })
}
