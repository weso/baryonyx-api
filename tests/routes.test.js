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
    expect(res.body[0]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/VaU0020aU0020morir')
    expect(res.body[0]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#1')
    expect(res.body[0]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00201')
    expect(res.body[1]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/AU0020verU0020siU0020funciona')
    expect(res.body[1]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#2')
    expect(res.body[1]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00202')
    expect(res.body[2]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/NoU0020puedeU0020respirarU0020bien')
    expect(res.body[2]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#3')
    expect(res.body[2]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00203')
  })

  // updating and adding new allergies to the user -- POST
  it('Adding new allergies to a new User : POST', async () => {
    const res = await request(app)
      .post('/symmetry/write')
      .send({
        "idcl": "45678G",
        "idal": ["1", "2", "8"],
        "allergy": ["Alergia 1 CAMBIADA", "Alergia 2 CAMBIADA", "Alergia 8"],
        "description": ["Fallo múltiple", "A ver si funciona", "Todo bien"]
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
    expect(res.body[0]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/FalloU0020múltiple')
    expect(res.body[0]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#1')
    expect(res.body[0]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00201U0020CAMBIADA')
    expect(res.body[1]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/AU0020verU0020siU0020funciona')
    expect(res.body[1]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#2')
    expect(res.body[1]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00202U0020CAMBIADA')
    expect(res.body[2]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/NoU0020puedeU0020respirarU0020bien')
    expect(res.body[2]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#3')
    expect(res.body[2]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00203')
    expect(res.body[3]['?descripcion'].value).toContain('https://oth2.solid.community/symmetry/45678G/TodoU0020bien')
    expect(res.body[3]['?id'].value).toContain('https://oth2.solid.community/symmetry/45678G/Alergias.ttl#8')
    expect(res.body[3]['?nombre'].value).toContain('https://oth2.solid.community/symmetry/45678G/AlergiaU00208')
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
