const request = require('supertest')
const app = require('../app')
jest.useFakeTimers()
jest.setTimeout(30000)

afterAll(done => {
  done()
})

// creating an allergy file for ta specific user
describe('Post Endpoints', () => {
  it('Updating and Adding Allergies : POST', async () => {
    const res = await request(app)
      .post('/symmetry/write')
      .send({
        "idcl": "123456789D",
        "idal": ["1", "2", "3"],
        "allergy": ["Alergia 1", "Alergia 2", "Alergia 3"],
        "description": ["Va a morir", "A ver si funciona", "No puede respirar bien"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Alergia Insertada')
  })
})

// make sure the data is correct -- GET
//TODO:

// updating and adding new allergies to the user -- POST
//TODO:

// make sure the data is updated -- GET
//TODO:

// deleting the user's allergyfile -- POST
//TODO:
