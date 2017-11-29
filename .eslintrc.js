module.exports = {
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    codeFrame: false,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      modules: true,
    }
  },
  rules: {
    'strict': 2,
    'valid-jsdoc': 'error',
    'no-plusplus': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
      }
    ],
    'import/no-extraneous-dependencies': [
      'error', { devDependencies: [
        '**/test/**/*.js'
      ] }
    ],
    'max-len': ['error', 120],
    'arrow-body-style': 'off',
  },
  env: {
    node: true,
    browser: true,
    mocha: true,
    es6: true
  },
  globals: {
    window: true,
    sinon: true,
    sinonChai: true
  },
  "overrides": [
    {
      "files": [ "test/*.js", "lib/*.js" ],
    }
  ]
};
