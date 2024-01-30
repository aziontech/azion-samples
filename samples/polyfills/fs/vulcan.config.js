module.exports = {
    entry: 'main.js', 
    builder: 'webpack',
    useNodePolyfills: true,
    memoryFS:{
        injectionDirs: ['static-html'],
    }
}