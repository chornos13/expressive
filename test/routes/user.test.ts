import helper from '../helper'

const app = helper.build()

test('user is added to DB', async () => {
  const res = await app.inject({
    url: '/user',
  })
  expect(res.json()).toEqual({
    user: {
      id: 1,
      firstName: 'Timber',
      lastName: 'Saw',
      isActive: false,
    },
  })
})
