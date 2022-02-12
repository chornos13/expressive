import Fastify from 'fastify'
import fp from 'fastify-plugin'
import { createConnection } from 'typeorm'
import App from '../src/app'

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_SERVICE, POSTGRES_PORT } =
  process.env

async function connectionBuild(db: string = 'postgres') {
  return createConnection({
    name: db,
    type: 'postgres',
    url: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVICE}:${POSTGRES_PORT}/${db}`,
    migrations: ['src/migration/**/*.ts'],
  })
}

// https://stackoverflow.com/a/2117523/1177228 ref: ahoy.js
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0
    // eslint-disable-next-line no-bitwise,eqeqeq
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default {
  build() {
    process.env.POSTGRES_DB = generateId()
    const { POSTGRES_DB } = process.env

    const app = Fastify()

    beforeAll(async () => {
      // Create new Database
      const connNewDb = await connectionBuild()
      const queryRunner = connNewDb.createQueryRunner()
      await queryRunner.createDatabase(POSTGRES_DB)
      await connNewDb.close()

      // Run Migration for created Database
      const connMigration = await connectionBuild(POSTGRES_DB)
      await connMigration.runMigrations()
      await connMigration.close()

      app.register(fp(App))
      await app.ready()
    })

    afterAll(async () => {
      await app.close()

      // Drop created Database
      const connDrop = await connectionBuild()
      const queryRunner = connDrop.createQueryRunner()
      await queryRunner.dropDatabase(POSTGRES_DB, true)
      await connDrop.close()
    })

    return app
  },
}
