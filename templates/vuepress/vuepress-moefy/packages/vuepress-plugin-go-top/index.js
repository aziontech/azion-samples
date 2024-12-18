const { resolve } = require('path')

module.exports = () => ({
  enhanceAppFiles: resolve(__dirname, './lib/enhanceAppFile.js'),
  globalUIComponents: 'GoTop',
})
