const defaultColorValue = 221
const UserConfigModel = {
  defaultConfigValues: {
    category: '',
    analysis: '',
    variable: '',
    label: '',
    color: defaultColorValue,
    min: '0',
    max: '1',
    text: true,
  },
  defaultFormValues: (overrides = {}) => ({
    configName: '',
    configType: 'matrix',
    readers: [],
    config: [],
    public: false,
    ...overrides,
  }),
  processNewConfig: (formValues, colors, owner) => {
    const config = {
      0: formValues.config.map(({ min, max, color, ...rest }) => {
        return {
          color: colors.find(({ value }) => value === color).label,
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
  },
  processConfigToFormFields: (currentConfig, colors) => {
    const {
      config,
      name,
      owner,
      public: publicConfig,
      readers,
      type,
    } = currentConfig
    const configKey = Object.keys(config)[0]
    const configCategoryFields = config[configKey].map(
      ({ category, analysis, variable, label, range, color, text }) => {
        const [min, max] = range
        const loadColor = findCategoryColor(color, colors)

        return {
          analysis,
          category,
          color: loadColor ? loadColor.value : defaultColorValue,
          label,
          min,
          max,
          text,
          variable,
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
  },
}

export const findCategoryColor = (categoryColors, colors) =>
  colors.find(({ label }) => categoryColors.every((el, i) => el === label[i]))

export default UserConfigModel
