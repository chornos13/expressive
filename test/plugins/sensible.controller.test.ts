import helper from '@test/helper'
import sensibleService from '@src/routes/sensible/sensible.service'
import * as yup from 'yup'

const app = helper.build()

describe('Sensible Plugin', () => {
  test('should reply with Yup Error Format given YupValidation error type', async () => {
    jest.spyOn(sensibleService, 'errorFunction').mockImplementation(() => {
      throw new yup.ValidationError(
        'anyMessage',
        'anyValue',
        'anyField',
        'anyType'
      )
    })

    const res = await app.inject({
      method: 'GET',
      url: '/test/error',
    })

    expect(res.json()).toEqual({
      statusCode: 422,
      message: 'anyMessage',
      error: 'Unprocessable Entity',
      errors: {
        anyField: 'anyMessage',
      },
    })
  })

  test('should reply with Default Error Format given regular Error', async () => {
    jest.spyOn(sensibleService, 'errorFunction').mockImplementation(() => {
      throw new Error('anyMessage')
    })

    const res = await app.inject({
      method: 'GET',
      url: '/test/error',
    })

    expect(res.json()).toEqual({
      statusCode: 500,
      message: 'anyMessage',
      error: 'Internal Server Error',
    })
  })
})
