const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

let userModel, fakeUserId

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await userModel.deleteMany({})

    const { ops } = await userModel.insertOne({
      email: 'valid_email@email.com',
      name: 'any_name',
      age: 10,
      state: 'any_state',
      password: 'hashed_password'
    })

    fakeUserId = ops[0]._id
  })

  it('Should update the user with the given accessToken', async () => {
    const sut = makeSut()

    await sut.update(fakeUserId, 'valid_token')

    const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })

    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  it('Should throw if no params are provided', async () => {
    const sut = makeSut()

    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
