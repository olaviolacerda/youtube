jest.mock('validator', () => ({
  isEmailValid: true,
  email: '',

  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}))

const validator = require('validator')
const EmailValidator = require('../helpers/email-validator')
const { MissingParamError } = require('../errors')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  it('Should returns true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@email.com')

    expect(isEmailValid).toBe(true)
  })

  it('Should returns false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email@email.com')

    expect(isEmailValid).toBe(false)
  })

  it('Should call validator with correct email', () => {
    const sut = makeSut()
    sut.isValid('any_email@mail.com')

    expect(validator.email).toBe('any_email@mail.com')
  })

  it('Should throw if no email is provided', () => {
    const sut = makeSut()
    expect(() => { sut.isValid() }).toThrow(new MissingParamError('email'))
  })
})
