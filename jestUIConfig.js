module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jestSetup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}
