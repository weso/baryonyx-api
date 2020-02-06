const request = require('supertest')
const app = require('../app')
const url = 'https://oth2.solid.community/symmetry/45678G/'
jest.useFakeTimers()
jest.setTimeout(30000)

describe('Testing the API', () => {

  it('Adding one allergy to a new User : POST', async (done) => {
    const res = await request(app)
      .post('/symmetry/allergy/write')
      .send({
        "idcl": "45678G",
        "idal": ["1"],
        "idpr": ["1738456"],
        "name": ["Alergia 1"],
        "description": ["Va a morir"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('No user was found with ID 45678G. Therefore, a folder was created for him. The allergy or allergies were successfully inserted.')
    done()
  })

  it('Reading the allergy inserted : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/45678G')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '45678G'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain(url + 'VaU0020aU0020morir')
    expect(res.body[0]['?id'].value).toContain(url + 'Alergias.ttl#1')
    expect(res.body[0]['?nombre'].value).toContain(url + 'AlergiaU00201')
    expect(res.body[0]['?propietario'].value).toContain(url + '1738456')
    done()
  })

  it('Deleting the allergy user file created by POST', async (done) => {
    const res = await request(app)
      .delete('/symmetry/file/allergy')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('The Allergy file has been deleted.')
    done()
  })

  it('Deleting the user folder', async (done) => {
    const res = await request(app)
      .delete('/symmetry/user')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('User 45678G folder has been deleted.')
    done()
  })

  // empty allergies for a non existing user
  it('Empty allergies for a non existing user : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/45678G')

    expect(res.statusCode).toEqual(404)
    //empty file
    expect(res.body).not.toHaveProperty('descripcion')
    expect(res.body).not.toHaveProperty('nombre')
    expect(res.body).not.toHaveProperty('propietario')
    done()
  })

  // creating an allergy file for ta specific user
  it('Adding new allergies to a new User : POST', async (done) => {
    const res = await request(app)
      .post('/symmetry/allergy/write')
      .send({
        "idcl": "45678G",
        "idal": ["1", "2", "3"],
        "idpr": ["1738456", "34643636", "8673935"],
        "name": ["Alergia 1", "Alergia 2", "Alergia 3"],
        "description": ["Va a morir", "A ver si funciona", "No puede respirar bien"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('The allergy or allergies were successfully inserted on user 45678G\'s folder.')
    done()
  })

  // make sure the data is correct -- GET
  it('Reading the allegies inserted : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/45678G')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '45678G'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain(url + 'VaU0020aU0020morir')
    expect(res.body[0]['?id'].value).toContain(url + 'Alergias.ttl#1')
    expect(res.body[0]['?nombre'].value).toContain(url + 'AlergiaU00201')
    expect(res.body[0]['?propietario'].value).toContain(url + '1738456')
    expect(res.body[1]['?descripcion'].value).toContain(url + 'AU0020verU0020siU0020funciona')
    expect(res.body[1]['?id'].value).toContain(url + 'Alergias.ttl#2')
    expect(res.body[1]['?nombre'].value).toContain(url + 'AlergiaU00202')
    expect(res.body[1]['?propietario'].value).toContain(url + '34643636')
    expect(res.body[2]['?descripcion'].value).toContain(url + 'NoU0020puedeU0020respirarU0020bien')
    expect(res.body[2]['?id'].value).toContain(url + 'Alergias.ttl#3')
    expect(res.body[2]['?nombre'].value).toContain(url + 'AlergiaU00203')
    expect(res.body[2]['?propietario'].value).toContain(url + '8673935')
    done()
  })

  // updating and adding new allergies to the user -- POST
  it('Updating an existent allergy', async (done) => {
    const res = await request(app)
      .put('/symmetry/allergy/update')
      .send({
        "idcl": "45678G",
        "idal": ["1"],
        "idpr": ["1738457"],
        "name": ["Alergia 1 CHANGED"],
        "description": ["Causes multiple organ failure."]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('The allergy 1 was successfully updated on user 45678G\'s folder.')
    done()
  })

  it('Updating a non existent allergy to a existent user', async (done) => {
    const res = await request(app)
      .put('/symmetry/allergy/update')
      .send({
        "idcl": "45678G",
        "idal": ["7"],
        "idpr": ["35456474"],
        "name": ["Peniciline"],
        "description": ["Severe irritation"]
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('No user was found with ID 45678G or allergy with ID 7 could not be found.')
    done()
  })

  // make sure the data is updated -- GET
  it('Reading the allergies updated : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/45678G')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '45678G'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain(url + 'CausesU0020multipleU0020organU0020failure')
    expect(res.body[0]['?id'].value).toContain(url + 'Alergias.ttl#1')
    expect(res.body[0]['?nombre'].value).toContain(url + 'AlergiaU00201U0020CHANGED')
    expect(res.body[0]['?propietario'].value).toContain(url + '1738457')
    expect(res.body[1]['?descripcion'].value).toContain(url + 'AU0020verU0020siU0020funciona')
    expect(res.body[1]['?id'].value).toContain(url + 'Alergias.ttl#2')
    expect(res.body[1]['?nombre'].value).toContain(url + 'AlergiaU00202')
    expect(res.body[1]['?propietario'].value).toContain(url + '34643636')
    expect(res.body[2]['?descripcion'].value).toContain(url + 'NoU0020puedeU0020respirarU0020bien')
    expect(res.body[2]['?id'].value).toContain(url + 'Alergias.ttl#3')
    expect(res.body[2]['?nombre'].value).toContain(url + 'AlergiaU00203')
    expect(res.body[2]['?propietario'].value).toContain(url + '8673935')
    done()
  })

  it('Deleting an existent allergy', async (done) => {
    const res = await request(app)
      .delete('/symmetry/allergy')
      .send({
        "idcl": "45678G",
        "idal": "2"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Allergy 2 has been successfully deleted.')
    done()
  })

  it('Deleting a non-existent allergy', async (done) => {
    const res = await request(app)
      .delete('/symmetry/allergy')
      .send({
        "idcl": "45678G",
        "idal": "8"
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('Either user 45678G could not be found, or the allergy 8 could not be found.')
    done()
  })

  it('Reading the allergies after deletion : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/45678G')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '45678G'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain(url + 'CausesU0020multipleU0020organU0020failure')
    expect(res.body[0]['?id'].value).toContain(url + 'Alergias.ttl#1')
    expect(res.body[0]['?nombre'].value).toContain(url + 'AlergiaU00201U0020CHANGED')
    expect(res.body[0]['?propietario'].value).toContain(url + '1738457')
    expect(res.body[1]['?descripcion'].value).toContain(url + 'NoU0020puedeU0020respirarU0020bien')
    expect(res.body[1]['?id'].value).toContain(url + 'Alergias.ttl#3')
    expect(res.body[1]['?nombre'].value).toContain(url + 'AlergiaU00203')
    expect(res.body[1]['?propietario'].value).toContain(url + '8673935')
    done()
  })

  it('Deleting the allergy user file created by GET', async (done) => {
    const res = await request(app)
      .delete('/symmetry/file/allergy')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('The Allergy file has been deleted.')
    done()
  })

  it('Deleting the user folder II', async (done) => {
    const res = await request(app)
      .delete('/symmetry/user')
      .send({
        "id": "45678G"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('User 45678G folder has been deleted.')
    done()
  })

})
