import helper from '../helper'

const app = helper.build()

test('default root route', async () => {
  const res = await app.inject({
    url: '/',
  })
  expect(res.json()).toEqual({ root: true })
})
