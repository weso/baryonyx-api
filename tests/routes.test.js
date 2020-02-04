const request = require('supertest')
const app = require('../app')
jest.useFakeTimers()
jest.setTimeout(30000)

describe('Testing the API', () => {

  it('Adding one allergy to a new User : POST', async (done) => {
    const res = await request(app)
      .post('/symmetry/write')
      .send({
        "idcl": "45678G",
        "idal": ["1"],
        "idpr": ["1738456"],
        "name": ["Alergia 1"],
        "description": ["Va a morir"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Alergia Insertada')
    done()
  })

  it('Reading the allergy inserted : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/alergias/45678G')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '45678G'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/VaU0020aU0020morir')
    expect(res.body[0]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#1')
    expect(res.body[0]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00201')
    expect(res.body[0]['?propietario'].value).toContain('https://oth2.solid.community/symmetry/45678G/1738456')
    done()
  })

  it('Deleting the allergy user file created by POST', async (done) => {
    const res = await request(app)
      .post('/symmetry/delete')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Fichero de Alergias Borrado!')
    done()
  })

  it('Deleting the user folder', async (done) => {
    const res = await request(app)
      .post('/symmetry/user/delete')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Carpeta del usuario 45678G Borrada!')
    done()
  })

  // empty allergies for a non existing user
  it('Empty allergies for a non existing user : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/alergias/45678G')

    expect(res.statusCode).toEqual(200)
    //empty file
    expect(res.body).not.toHaveProperty('descripcion')
    expect(res.body).not.toHaveProperty('nombre')
    expect(res.body).not.toHaveProperty('propietario')
    done()
  })

  // creating an allergy file for ta specific user
  it('Adding new allergies to a new User : POST', async (done) => {
    const res = await request(app)
      .post('/symmetry/write')
      .send({
        "idcl": "45678G",
        "idal": ["1", "2", "3"],
        "idpr": ["1738456", "34643636", "8673935"],
        "name": ["Alergia 1", "Alergia 2", "Alergia 3"],
        "description": ["Va a morir", "A ver si funciona", "No puede respirar bien"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Alergia Insertada')
    done()
  })

  // make sure the data is correct -- GET
  it('Reading the allegies inserted : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/alergias/45678G')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '45678G'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/VaU0020aU0020morir')
    expect(res.body[0]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#1')
    expect(res.body[0]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00201')
    expect(res.body[0]['?propietario'].value).toContain('https://oth2.solid.community/symmetry/45678G/1738456')
    expect(res.body[1]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/AU0020verU0020siU0020funciona')
    expect(res.body[1]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#2')
    expect(res.body[1]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00202')
    expect(res.body[1]['?propietario'].value).toContain('https://oth2.solid.community/symmetry/45678G/34643636')
    expect(res.body[2]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/NoU0020puedeU0020respirarU0020bien')
    expect(res.body[2]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#3')
    expect(res.body[2]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00203')
    expect(res.body[2]['?propietario'].value).toContain('https://oth2.solid.community/symmetry/45678G/8673935')
    done()
  })

  // updating and adding new allergies to the user -- POST
  it('Adding new allergies to a new User : POST', async (done) => {
    const res = await request(app)
      .post('/symmetry/write')
      .send({
        "idcl": "45678G",
        "idal": ["1", "2", "8"],
        "idpr": ["1738457", "34643636", "3737385"],
        "name": ["Alergia 1 CAMBIADA", "Alergia 2 CAMBIADA", "Alergia 8"],
        "description": ["Fallo múltiple", "A ver si funciona", "Todo bien"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Alergia Insertada')
    done()
  })

  // make sure the data is updated -- GET
  it('Reading the allergies updated : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/alergias/45678G')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '45678G'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/FalloU0020múltiple')
    expect(res.body[0]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#1')
    expect(res.body[0]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00201U0020CAMBIADA')
    expect(res.body[0]['?propietario'].value).toContain('https://oth2.solid.community/symmetry/45678G/1738457')
    expect(res.body[1]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/AU0020verU0020siU0020funciona')
    expect(res.body[1]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#2')
    expect(res.body[1]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00202U0020CAMBIADA')
    expect(res.body[1]['?propietario'].value).toContain('https://oth2.solid.community/symmetry/45678G/34643636')
    expect(res.body[2]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/NoU0020puedeU0020respirarU0020bien')
    expect(res.body[2]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#3')
    expect(res.body[2]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00203')
    expect(res.body[2]['?propietario'].value).toContain('https://oth2.solid.community/symmetry/45678G/8673935')
    expect(res.body[3]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/TodoU0020bien')
    expect(res.body[3]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#8')
    expect(res.body[3]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00208')
    expect(res.body[3]['?propietario'].value).toContain('https://oth2.solid.community/symmetry/45678G/3737385')
    done()
  })

  it('Deleting the allergy user file created by GET', async (done) => {
    const res = await request(app)
      .post('/symmetry/delete')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Fichero de Alergias Borrado!')
    done()
  })

  it('Deleting the user folder II', async (done) => {
    const res = await request(app)
      .post('/symmetry/user/delete')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Carpeta del usuario 45678G Borrada!')
    done()
  })

})
