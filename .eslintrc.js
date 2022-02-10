module.exports = {
  env: {
    es6: true,
    node: true,
    // resolve jest global variable in test files (test, describe, .etc)
    jest: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    // https://github.com/iamturns/eslint-config-airbnb-typescript#i-get-this-error-when-running-eslint-the-file-must-be-included-in-at-least-one-of-the-projects-provided
    project: './tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {},
  ignorePatterns: ['dist/*'],
}
