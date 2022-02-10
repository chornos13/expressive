import Fastify from 'fastify'
import fp from 'fastify-plugin'
import App from '../src/app'

export default {
  build() {
    const app = Fastify()

    beforeAll(async () => {
      app.register(fp(App))
      await app.ready()
    })

    afterAll(() => app.close())

    return app
  },
}
