import UserConfigModel from '.'

describe('Models - User Confg', () => {
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
    })
    const colors = [
      {
        value: 221,
        label: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
      },
    ]

    it('returns config form values as user config object', async () => {
      const newUserConfig = await UserConfigModel.processNewConfig(
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
            },
            {
              analysis: '',
              category: '',
              color: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
              label: '',
              range: ['0', '1'],
              variable: '',
            },
          ],
        },
        name: 'default',
        owner: 'owl',
        readers: ['fang', 'talon', 'mabel'],
        type: 'matrix',
      })
    })
  })
})
