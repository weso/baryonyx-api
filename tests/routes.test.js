const request = require('supertest')
const app = require('../app')
jest.useFakeTimers()
jest.setTimeout(30000)

afterAll(done => {
  done()
})

describe('Testing the API', () => {
  // empty allergies for a non existing user
  it('Empty allergies for a non existing user : GET', async () => {
    const res = await request(app)
      .get('/symmetry/alergias/45678G')

    expect(res.statusCode).toEqual(200)
    //empty file
    expect(res.body).not.toHaveProperty('descripcion')
    expect(res.body).not.toHaveProperty('nombre')
  })

  // creating an allergy file for ta specific user
  it('Adding new allergies to a new User : POST', async () => {
    const res = await request(app)
      .post('/symmetry/write')
      .send({
        "idcl": "45678G",
        "idal": ["1", "2", "3"],
        "allergy": ["Alergia 1", "Alergia 2", "Alergia 3"],
        "description": ["Va a morir", "A ver si funciona", "No puede respirar bien"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Alergia Insertada')
  })

  // make sure the data is correct -- GET
  //TODO:
  it('Reading the allegies inserted : GET', async () => {
    const res = await request(app)
      .get('/symmetry/alergias/45678G')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '45678G'
    expect(res.type).toEqual('application/json')
    // expect(res.json).toContain('Alergia')
  })

  // updating and adding new allergies to the user -- POST
  it('Adding new allergies to a new User : POST', async () => {
    const res = await request(app)
      .post('/symmetry/write')
      .send({
        "idcl": "45678G",
        "idal": ["1", "2", "8"],
        "allergy": ["Alergia 1 CAMBIADA", "Alergia 2 CAMBIADA", "Alergia 8"],
        "description": ["Va a morir", "A ver si funciona", "Todo bien"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Alergia Insertada')
  })

  // make sure the data is updated -- GET
  //TODO:
  it('Reading the allegies updated : GET', async () => {
    const res = await request(app)
      .get('/symmetry/alergias/45678G')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '45678G'
    expect(res.type).toEqual('application/json')
    // expect(res.json).toContain('Alergia')
  })

  it('Deleting the allergy user file', async () => {
    const res = await request(app)
      .post('/symmetry/delete')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Fichero de Alergias Borrado!')
  })

  it('Deleting the user folder', async () => {
    const res = await request(app)
      .post('/symmetry/user/delete')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Carpeta del usuario 45678G Borrada!')
  })

})
