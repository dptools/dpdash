import UserConfigModel from '.'
import { findCategoryColor } from '.'
import { createColorList } from '../../../test/fixtures'

describe('Models - User Config', () => {
  const colors = [
    {
      value: 221,
      label: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
    },
  ]

  describe(UserConfigModel.processNewConfig, () => {
    const formValues = UserConfigModel.defaultFormValues({
      readers: [
        { label: 'fang', value: 'fang' },
        { label: 'talon', value: 'talon' },
        { label: 'mabel', value: 'mabel' },
      ],
      config: [
        UserConfigModel.defaultConfigValues,
        UserConfigModel.defaultConfigValues,
      ],
      public: false,
    })

    it('returns config form values as user config object', () => {
      const newUserConfig = UserConfigModel.processNewConfig(
        formValues,
        colors,
        'owl'
      )

      expect(newUserConfig).toEqual({
        config: {
          0: [
            {
              analysis: '',
              category: '',
              color: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
              label: '',
              range: ['0', '1'],
              variable: '',
              text: true,
            },
            {
              analysis: '',
              category: '',
              color: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
              label: '',
              range: ['0', '1'],
              variable: '',
              text: true,
            },
          ],
        },
        name: '',
        owner: 'owl',
        readers: ['fang', 'talon', 'mabel'],
        type: 'matrix',
        public: false,
      })
    })
  })

  describe(UserConfigModel.processConfigToFormFields, () => {
    it('returns a current configuration into form values', async () => {
      const currentConfiguration = {
        config: {
          0: [
            {
              analysis: '',
              category: '',
              color: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
              label: '',
              range: ['0', '1'],
              variable: '',
              text: true,
            },
            {
              analysis: '',
              category: '',
              color: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
              label: '',
              range: ['0', '1'],
              variable: '',
              text: true,
            },
          ],
        },
        name: '',
        owner: 'owl',
        readers: ['fang', 'talon', 'owl'],
        type: 'matrix',
        public: true,
      }
      const formFields = await UserConfigModel.processConfigToFormFields(
        currentConfiguration,
        colors
      )

      expect(formFields).toEqual(
        UserConfigModel.defaultFormValues({
          owner: 'owl',
          readers: [
            { label: 'fang', value: 'fang', isFixed: false },
            { label: 'talon', value: 'talon', isFixed: false },
            { label: 'owl', value: 'owl', isFixed: true },
          ],
          config: [
            UserConfigModel.defaultConfigValues,
            UserConfigModel.defaultConfigValues,
          ],
          public: true,
        })
      )
    })
  })
})

describe('findCategoryColor', () => {
  it('finds the correct color value from color list', () => {
    const colorList = createColorList()
    const categoryColors = [
      '#ffffcc',
      '#d9f0a3',
      '#addd8e',
      '#78c679',
      '#31a354',
      '#006837',
    ]
    expect(findCategoryColor(categoryColors, colorList)).toEqual({
      label: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'],
      value: 3,
    })
  })
})
