const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_SERVICE,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env

/** @type {import('typeorm').ConnectionOptions} */
module.exports = {
  type: 'postgres',
  url: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVICE}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  entities: [`${__dirname}/../routes/**/*.entity.{ts,js}`],
  migrationsTableName: '_migrations',
  migrations: ['src/migration/**/*.ts'],
  cli: {
    migrationsDir: 'src/migration',
  },
}
