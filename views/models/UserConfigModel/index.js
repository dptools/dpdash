const defaultColorValue = {
  value: 221,
  label: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
}
const UserConfigModel = {
  defaultConfigValues: {
    category: '',
    analysis: '',
    variable: '',
    label: '',
    color: defaultColorValue,
    min: '0',
    max: '1',
  },
  defaultFormValues: (overrides = {}) => ({
    configName: 'default',
    configType: 'matrix',
    readers: [],
    config: [],
    ...overrides,
  }),
  processNewConfig: async (formValues, colors, owner) => {
    try {
      const config = {
        0: formValues.config.map(({ min, max, color, ...rest }) => {
          return {
            color: colors.find(({ value }) => value === color.value).label,
            range: [min, max],
            ...rest,
          }
        }),
      }

      return {
        config,
        name: formValues.configName,
        owner,
        type: formValues.configType,
        readers: formValues.readers.map(({ value }) => value),
      }
    } catch (error) {
      throw new Error('There was a problem processing the form')
    }
  },
  successMessage: 'Config Added Successfully',
}

export default UserConfigModel
