const MongoHelper = require('../../infra/helpers/mongo-helper')
const request = require('supertest')
const app = require('../config/app')
const bcrypt = require('bcrypt')

let userModel

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await userModel.deleteMany({})
  })

  it('Should return 200 when valid credentials are provided', async () => {
    await userModel.insertOne({
      email: 'valid_email@email.com',
      password: bcrypt.hashSync('hashed_password', 10)
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@email.com',
        password: 'hashed_password'
      })
      .expect(200)
  })

  it('Should return 401 when invalid credentials are provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@email.com',
        password: 'hashed_password'
      })
      .expect(401)
  })
})
