import { colorList } from './colorList'

const colorObj = {
  schemeGroups: {
    sequential: [
      'BuGn',
      'BuPu',
      'GnBu',
      'OrRd',
      'PuBu',
      'PuBuGn',
      'PuRd',
      'RdPu',
      'YlGn',
      'YlGnBu',
      'YlOrBr',
      'YlOrRd',
    ],
    singlehue: ['Blues', 'Greens', 'Greys', 'Oranges', 'Purples', 'Reds'],
    diverging: [
      'BrBG',
      'PiYG',
      'PRGn',
      'PuOr',
      'RdBu',
      'RdGy',
      'RdYlBu',
      'RdYlGn',
      'Spectral',
    ],
    qualitative: [
      'Accent',
      'Dark2',
      'Paired',
      'Pastel1',
      'Pastel2',
      'Set1',
      'Set2',
      'Set3',
    ],
  },
  YlGn: {
    3: ['#f7fcb9', '#addd8e', '#31a354'],
    4: ['#ffffcc', '#c2e699', '#78c679', '#238443'],
    5: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
    6: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'],
  },
}

describe('Utils - colorList', () => {
  it('returns an array of objects containing a label and values property', () => {
    const colors = colorList(colorObj)
    expect(colors).toEqual([
      { value: 0, label: ['#f7fcb9', '#addd8e', '#31a354'] },
      { value: 1, label: ['#ffffcc', '#c2e699', '#78c679', '#238443'] },
      {
        value: 2,
        label: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
      },
      {
        label: [
          '#ffffcc',
          '#d9f0a3',
          '#addd8e',
          '#78c679',
          '#31a354',
          '#006837',
        ],
        value: 3,
      },
    ])
  })
})

const colorbrewer = {}
