module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    instance: {},
    autoStart: false,
  },

  useSharedDBForAllJestWorkers: false,
};
