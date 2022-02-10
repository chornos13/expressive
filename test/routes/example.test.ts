import helper from '../helper'

const app = helper.build()

test('example is loaded', async () => {
  const res = await app.inject({
    url: '/example',
  })
  expect(res.payload).toEqual('this is an example')
})
