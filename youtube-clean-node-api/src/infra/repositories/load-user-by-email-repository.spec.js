const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const { MissingParamError } = require('../../utils/errors')

let userModel

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmail Repository', () => {
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

  it('Should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@email.com')
    expect(user).toBeNull()
  })

  it('Should return an user if user is found', async () => {
    const sut = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      name: 'any_name',
      age: 10,
      state: 'any_state',
      password: 'hashed_password'
    })
    const user = await sut.load('valid_email@email.com')

    const { _id, password } = fakeUser.ops[0]

    expect(user).toEqual({
      _id, password
    })
  })

  it('Should throw if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
