module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    instance: {},
    autoStart: false,
  },
  mongoURLEnvName: 'MONGODB_URI',
}
