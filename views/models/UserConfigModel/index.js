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
    public: false,
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
        public: formValues.public,
      }
    } catch (error) {
      throw new Error('There was a problem processing the form')
    }
  },
  processConfigToFormFields: async (currentConfig, colors) => {
    try {
      const {
        name,
        type,
        owner,
        readers,
        config,
        public: publicConfig,
      } = currentConfig
      const configKey = Object.keys(config)[0]
      const configCategoryFields = config[configKey].map(
        ({ category, analysis, variable, label, range, color }) => {
          const [min, max] = range
          return {
            analysis,
            category,
            variable,
            label,
            min,
            max,
            color: findCategoryColor(color, colors) || defaultColorValue,
          }
        }
      )
      return {
        configName: name,
        configType: type,
        owner: owner,
        readers: readers.map((reader) => ({
          value: reader,
          label: reader,
          isFixed: reader === owner,
        })),
        config: configCategoryFields,
        public: publicConfig,
      }
    } catch (error) {
      throw new Error('There was an error processing the configuration')
    }
  },
  message: {
    successAdd: 'Config Added Successfully',
    successUpdate: 'Config Updated Successfully ',
  },
}

export const findCategoryColor = (categoryColors, colors) => {
  return colors.find(({ label }) =>
    categoryColors.every((el, i) => el === label[i])
  )
}
export default UserConfigModel
