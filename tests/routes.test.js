const request = require('supertest')
const app = require('../app')
const url = 'https://oth2.solid.community/symmetry/456789/'
jest.useFakeTimers()
jest.setTimeout(30000)

describe('Testing the API', () => {

  it('Adding one allergy to a new User : POST', async (done) => {
    const res = await request(app)
      .post('/symmetry/allergy')
      .send({
        "idcl": "456789",
        "idal": ["1"],
        "idpr": ["1738456"],
        "name": ["Alergia 1"],
        "description": ["Va a morir"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('No user was found with ID 456789. Therefore, a folder was created for him. The allergy or allergies were successfully inserted.')
    done()
  })

  it('Reading the allergy inserted : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/456789')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '456789'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain('Va a morir')
    expect(res.body[0]['?id'].value).toContain('1')
    expect(res.body[0]['?nombre'].value).toContain('Alergia 1')
    expect(res.body[0]['?propietario'].value).toContain('1738456')
    done()
  })

  it('Deleting the allergy user file created by POST', async (done) => {
    const res = await request(app)
      .delete('/symmetry/file/allergy/456789')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('The Allergy file has been deleted.')
    done()
  })

  it('Deleting the user folder', async (done) => {
    const res = await request(app)
      .delete('/symmetry/user/456789')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('User 456789 folder has been deleted.')
    done()
  })

  // empty allergies for a non existing user
  it('Empty allergies for a non existing user : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/456789')

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
      .post('/symmetry/allergy')
      .send({
        "idcl": "456789",
        "idal": ["1", "2", "3"],
        "idpr": ["1738456", "34643636", "8673935"],
        "name": ["Alergia 1", "Alergia 2", "Alergia 3"],
        "description": ["Va a morir", "A ver si funciona", "No puede respirar bien"]
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('The allergy or allergies were successfully inserted on user 456789\'s folder.')
    done()
  })

  // make sure the data is correct -- GET
  it('Reading the allegies inserted : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/456789')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '456789'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain('Va a morir')
    expect(res.body[0]['?id'].value).toContain('1')
    expect(res.body[0]['?nombre'].value).toContain('Alergia 1')
    expect(res.body[0]['?propietario'].value).toContain('1738456')
    expect(res.body[1]['?descripcion'].value).toContain('A ver si funciona')
    expect(res.body[1]['?id'].value).toContain('2')
    expect(res.body[1]['?nombre'].value).toContain('Alergia 2')
    expect(res.body[1]['?propietario'].value).toContain('34643636')
    expect(res.body[2]['?descripcion'].value).toContain('No puede respirar bien')
    expect(res.body[2]['?id'].value).toContain('3')
    expect(res.body[2]['?nombre'].value).toContain('Alergia 3')
    expect(res.body[2]['?propietario'].value).toContain('8673935')
    done()
  })

  // updating and adding new allergies to the user -- POST
  it('Updating an existent allergy', async (done) => {
    const res = await request(app)
      .put('/symmetry/allergy')
      .send({
        "idcl": "456789",
        "idal": "1",
        "idpr": "1738457",
        "name": "Alergia 1 CHANGED",
        "description": "Causes multiple organ failure."
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('The allergy 1 was successfully updated on user 456789\'s folder.')
    done()
  })

  it('Updating a non existent allergy to a existent user', async (done) => {
    const res = await request(app)
      .put('/symmetry/allergy')
      .send({
        "idcl": "456789",
        "idal": "7",
        "idpr": "35456474",
        "name": "Peniciline",
        "description": "Severe irritation"
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('No user was found with ID 456789 or allergy with ID 7 could not be found.')
    done()
  })

  it('Updating a non existent allergy to a non existent user', async (done) => {
    const res = await request(app)
      .put('/symmetry/allergy')
      .send({
        "idcl": "123456",
        "idal": "7",
        "idpr": "35456474",
        "name": "Peniciline",
        "description": "Severe irritation"
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('No user was found with ID 123456 or allergy with ID 7 could not be found.')
    done()
  })

  // make sure the data is updated -- GET
  it('Reading the allergies updated : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/456789')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '456789'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain('Causes multiple organ failure')
    expect(res.body[0]['?id'].value).toContain('1')
    expect(res.body[0]['?nombre'].value).toContain('Alergia 1 CHANGED')
    expect(res.body[0]['?propietario'].value).toContain('1738457')
    expect(res.body[1]['?descripcion'].value).toContain('A ver si funciona')
    expect(res.body[1]['?id'].value).toContain('2')
    expect(res.body[1]['?nombre'].value).toContain('Alergia 2')
    expect(res.body[1]['?propietario'].value).toContain('34643636')
    expect(res.body[2]['?descripcion'].value).toContain('No puede respirar bien')
    expect(res.body[2]['?id'].value).toContain('3')
    expect(res.body[2]['?nombre'].value).toContain('Alergia 3')
    expect(res.body[2]['?propietario'].value).toContain('8673935')
    done()
  })

  it('Deleting an existent allergy', async (done) => {
    const res = await request(app)
      .delete('/symmetry/allergy/456789/2')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Allergy 2 has been successfully deleted.')
    done()
  })

  it('Deleting a non-existent allergy of an existent user', async (done) => {
    const res = await request(app)
      .delete('/symmetry/allergy/456789/8')
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('Either user 456789 could not be found, or the allergy 8 could not be found.')
    done()
  })

  it('Deleting a non-existent allergy from a non existent user', async (done) => {
    const res = await request(app)
      .delete('/symmetry/allergy/123456/8')
      .send({
        "idcl": "123456",
        "idal": "8"
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('Either user 123456 could not be found, or the allergy 8 could not be found.')
    done()
  })

  it('Reading the allergies after deletion : GET', async (done) => {
    const res = await request(app)
      .get('/symmetry/allergy/456789')
    expect(res.statusCode).toEqual(200)
    expect(res.body).not.toHaveProperty('error')
    const id = '456789'
    expect(res.type).toEqual('application/json')
    expect(res.body[0]['?descripcion'].value).toContain('Causes multiple organ failure')
    expect(res.body[0]['?id'].value).toContain('1')
    expect(res.body[0]['?nombre'].value).toContain('Alergia 1 CHANGED')
    expect(res.body[0]['?propietario'].value).toContain('1738457')
    expect(res.body[1]['?descripcion'].value).toContain('No puede respirar bien')
    expect(res.body[1]['?id'].value).toContain('3')
    expect(res.body[1]['?nombre'].value).toContain('Alergia 3')
    expect(res.body[1]['?propietario'].value).toContain('8673935')
    done()
  })

  it('Deleting the allergy user file created by GET', async (done) => {
    const res = await request(app)
      .delete('/symmetry/file/allergy/456789')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('The Allergy file has been deleted.')
    done()
  })

  it('Deleting the user folder II', async (done) => {
    const res = await request(app)
      .delete('/symmetry/user/456789')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('User 456789 folder has been deleted.')
    done()
  })

  it('Deleting a non existent allergy file', async (done) => {
    const res = await request(app)
      .delete('/symmetry/file/allergy/456789')
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('The Allergy file does not exist or could not be found.')
    done()
  })

  it('Deleting a non existent user folder', async (done) => {
    const res = await request(app)
      .delete('/symmetry/user/456789')
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('User 456789 folder does not exist or could not be found.')
    done()
  })

})
