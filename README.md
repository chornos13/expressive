# Expressive

## Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Recommended way running in Development (Docker)

1. Copy env example -> `cp .env.example .env`
2. Build docker images -> `docker-compose build app`
3. Run Dev -> `docker-compose up app`
4. Access (http://localhost:3001)

### For Testing (Docker)

- Run ESLint tests -> `docker-compose run app yarn test:eslint`
- Run Jest tests -> `docker-compose run app yarn test`

## Running without Docker
### Make sure you have postgres installed in your local Computer

1. Copy env example -> `cp .env.example .env`
2. Install module -> `yarn install`
3. Running Development -> `npm run dev`
4. Access (http://localhost:3001)

### For Testing without Docker

- Run ESLint tests -> `yarn test:eslint`
- Run Jest tests -> `yarn test`

### For Production
- Run Production -> `npm start`
- Access (https://localhost:3001)

## Learn More

To learn Fastify, check out the [Fastify documentation](https://www.fastify.io/docs/latest/).

## Roadmap
- [x] Init Fastify
- [x] Using Typescript
- [x] Using Jest instead of Tap
- [x] Init Docker
- [x] Add Postgres DB to docker-compose
- [x] Setup Prettier
- [x] Setup ESLint
- [x] Setup Github Action for Testing
- [x] Setup Type ORM
- [x] Setup Absolute Import
- [ ] Add package.json script to run testing in docker
- [ ] Setup docker-services
- [ ] Setup Conventional Commit
- [ ] Setup Versioning
- [ ] Add Swagger
- [ ] Pre-commit Git Hook with Testing
