module.exports = {
  app: null,
  Q: null,
  fetch: null,
  newEngine: null,
  fileClient: null,
  init: function (app, Q, fetch, newEngine, fileClient, namespaces) {
    this.app = app
    this.Q = Q
    this.fetch = fetch
    this.newEngine = newEngine
    this.fileClient = fileClient
    this.namespaces = namespaces
  },
  leer: async function (url, alid) {
    let path = url + '/Alergias.ttl'
    if (!(await this.existFolder(url))) {
      await this.fileClient.createFolder(url)
      await this.fileClient.createFile(path, '', 'text/turtle')
      return false
    }
    let contenido = await this.fileClient.readFile(path)
    let regexid
    if (alid) {
      regexid = new RegExp(':' + alid + '[ ]+a schem:MedicalContraindication;', 'g')
    } else {
      regexid = /:[0-9 ]+a schem:MedicalContraindication;/g
    }
    let regexdesc = /:description (.*?);/g
    let regexpr = /:identifier (.*?);/g
    let regexnm = /:name (.*?)[.]/g
    let b = contenido.replace(/[@](.*?)[>][.]/g, '').replace(/\r?\n|\r|\t/g, '')

    let id = []
    let ds = []
    let pr = []
    let nm = []
    b.replace(regexid, function (match) {
      id.push(match.replace(/[:; ]+/g, '')
        .split('a')[0])
    })

    b.replace(regexdesc, function (match) {
      ds.push(match.replace(' <', ':')
        .replace(/[> ]*/g, '')
        .split(':').slice(2).join(':')
        .replace(/U0020/g, ' ')
        .replace(/U003B/g, ';')
        .slice(0, -1))
    })

    b.replace(regexpr, function (match) {
      pr.push(match.replace(' <', ':')
        .replace(/[> ]*/g, '')
        .split(':')[2]
        .slice(0, -1))
    })

    b.replace(regexnm, function (match) {
      nm.push(match.replace(' <', ':')
        .replace(/[> ]*/g, '')
        .split(':').slice(2).join(':')
        .replace(/U0020/g, ' ')
        .slice(0, -1))
    })

    let alergias = []
    for (let i = 0; i < id.length; i++) {
      let alergia = {
        '?descripcion': { 'value': ds[i] },
        '?id': { 'value': id[i] },
        '?nombre': { 'value': nm[i] },
        '?propietario': { 'value': pr[i] }
      }
      alergias.push(alergia)
    }
    return alergias
  },
  existFolder: async function (folderName) {
    if ((await this.fileClient.itemExists(folderName))) {
      return true
    } else {
      return false
    }
  },
  writeInFolder: async function (url, contenido) {

    let userfound = true

    let predicado = ''

    for (let i = 0; i < contenido.idcl.length; i++) {
      let path = url + contenido.idcl[i] + '/Alergias.ttl'
      // create id folder if it does not exist
      if (!(await this.existFolder(url))) {
        await this.fileClient.createFolder(url)
        await this.fileClient.createFile(path, '', 'text/turtle')
        userfound = false
      }
      // allergies and description without spaces
      let descriptionNoSpace = contenido.description[i].split(' ').join('U0020').split(';').join('U003B')
      let nameNoSpace = contenido.name[i].split(' ').join('U0020')
      // content to be inserted in the pod
      predicado = '\n<#' + contenido.idal[i] + '> a <' + this.namespaces.schema + 'MedicalContraindication>;' +
        '<' + this.namespaces.schema + 'description> <' + descriptionNoSpace + '>;' +
        '<' + this.namespaces.schema + 'identifier> <' + contenido.idpr[i] + '>;' +
        '<' + this.namespaces.schema + 'name> <' + nameNoSpace + '>.'

      await this.executeSPARQLUpdate(path, 'INSERT DATA {' + predicado + '}')
    }

    return userfound
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
  deleteAllergyFile: async function (symmetryPathWithID) {
    var alrgyPath = symmetryPathWithID + '/Alergias.ttl'
    if (!(await this.existFolder(symmetryPathWithID))) {
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
  deleteUserFolder: async function (symmetryPathWithID) {
    // checks if folder and file exists
    if (!(await this.existFolder(symmetryPathWithID))) {
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
  updateAllergy: async function (url, contenido) {
    let path = url + '/Alergias.ttl'
    // create id folder if it does not exist
    if (!(await this.existFolder(url))) {
      return false
    }

    // create allergy file
    let resp = await this.leer(url)
    let nombre, desc, prop
    let allergyFound = 0
    for (var j = 0; j < resp.length; j++) {
      if (resp[j]['?id'].value === contenido.idal) {
        nombre = resp[j]['?nombre'].value.split(' ').join('U0020')
        desc = resp[j]['?descripcion'].value.split(' ').join('U0020').split(';').join('U003B')
        prop = resp[j]['?propietario'].value
        allergyFound = 1
        break
      }
    }
    if (allergyFound === 1) {
      // deleting previous allergy
      await this.executeSPARQLUpdate(path, 'DELETE DATA { <#' + contenido.idal +
        '> a <http://schema.org/MedicalContraindication>;' +
        '<http://schema.org/description> <' + desc + '>;' +
        '<http://schema.org/identifier> <' + prop + '>;' +
        '<http://schema.org/name> <' + nombre + '>.}')

      // adding updated allergy
      // allergies and description without spaces
      let descr = contenido.description + ''
      nombre = contenido.name + ''
      let descriptionNoSpace = descr.split(' ').join('U0020').split(';').join('U003B')
      let nameNoSpace = nombre.split(' ').join('U0020')
      // content to be inserted in the pod
      let predicadoins = '\n<#' + contenido.idal + '> a <' + this.namespaces.schema + 'MedicalContraindication>;' +
        '<' + this.namespaces.schema + 'description> <' + descriptionNoSpace + '>;' +
        '<' + this.namespaces.schema + 'identifier> <' + contenido.idpr + '>;' +
        '<' + this.namespaces.schema + 'name> <' + nameNoSpace + '>.'

      await this.executeSPARQLUpdate(path, 'INSERT DATA {' + predicadoins + '}')
      return true
    } else {
      return false
    }
  },
  deleteAllergy: async function (url, contenido) {
    let path = url + '/Alergias.ttl'
    // create id folder if it does not exist
    if (!(await this.existFolder(url))) {
      return false
    }

    // create allergy file
    let resp = await this.leer(url)
    let nombre, desc, prop
    let allergyFound = 0
    for (var j = 0; j < resp.length; j++) {
      if (resp[j]['?id'].value === contenido.idal) {
        nombre = resp[j]['?nombre'].value.split(' ').join('U0020')
        desc = resp[j]['?descripcion'].value.split(' ').join('U0020').split(';').join('U003B')
        prop = resp[j]['?propietario'].value
        allergyFound = 1
        break
      }
    }
    if (allergyFound === 1) {
      // deleting previous allergy
      await this.executeSPARQLUpdate(path, 'DELETE DATA { <#' + contenido.idal +
        '> a <http://schema.org/MedicalContraindication>;' +
        '<http://schema.org/description> <' + desc + '>;' +
        '<http://schema.org/identifier> <' + prop + '>;' +
        '<http://schema.org/name> <' + nombre + '>.}')
      return true
    } else {
      return false
    }
  }
}
