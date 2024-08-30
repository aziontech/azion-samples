module.exports = {
  entry: 'index.js',
  builder: 'esbuild',
  useNodePolyfills: true,
  memoryFS: {
    injectionDirs: ['files/'],
    removePathPrefix: 'files/',
  },
}