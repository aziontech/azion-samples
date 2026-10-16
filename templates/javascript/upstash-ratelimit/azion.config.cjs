module.exports = {
  version: 3,
  build: {
    preset: 'javascript',
    entry: ['main.js'],
    polyfills: true
  },
  functions: [
    {
      name: '$APPLICATION_NAME',
      path: './functions/main.js'
    }
  ],
  rules: {
    request: [
      {
        name: 'Execute Edge Function',
        match: '^\/',
        behavior: {
          runFunction: '$APPLICATION_NAME'
        }
      }
    ]
  }
}