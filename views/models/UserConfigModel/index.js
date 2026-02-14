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
    description: '',
    readers: [],
    config: [],
    public: false,
    ...overrides,
  }),
  publishConfig: (formValues, colors, owner) => ({
    ...processConfigAssessment(formValues, colors, owner),
    status: 1,
  }),
  saveAsDraft: (formValues, colors, owner) => ({
    ...processConfigAssessment(formValues, colors, owner),
    status: 0,
  }),
  processConfigToFormFields: (currentConfig, colors) => {
    const {
      config,
      description,
      name,
      owner,
      public: publicConfig,
      readers,
      type,
      updatedAt,
      status,
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
      description: description || '',
      owner,
      readers: readers
        .map((reader) => ({
          value: reader,
          label: reader,
        }))
        .filter(({ label }) => label !== owner),
      config: configCategoryFields,
      public: publicConfig,
      updatedAt,
      status,
    }
  },
  isActive: (configuration, property) =>
    configuration[property] === 1 || !Object.hasOwn(configuration, property),
}

export const findCategoryColor = (categoryColors, colors) =>
  colors.find(({ label }) => categoryColors.every((el, i) => el === label[i]))

const processConfigAssessment = (formValues, colors, owner) => {
  return {
    config: {
      0: formValues.config.map(({ min, max, color, ...rest }) => {
        return {
          color: colors.find(({ value }) => value === color).label,
          range: [min, max],
          ...rest,
        }
      }),
    },
    description: formValues.description,
    name: formValues.configName,
    public: formValues.public,
    owner,
    readers: formValues.readers.map(({ value }) => value),
    type: formValues.configType,
  }
}

export default UserConfigModel
