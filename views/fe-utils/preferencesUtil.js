const babyProofPreferences = (preferences) => {
  const defaultPreferences = {
    complete: {},
    star: {},
    sort: 0,
  }

  return { ...defaultPreferences, ...preferences }
}

export const preparePreferences = (configurationId = '', preferences = {}) => ({
  ...babyProofPreferences(preferences),
  config: configurationId,
})
