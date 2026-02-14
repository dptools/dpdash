import { colorList } from './colorList'
import { createColorList, createColorbrewer } from '../../test/fixtures'

const colorbrewer = createColorbrewer()

describe('Utils - colorList', () => {
  it('returns an array of objects containing a label and values property', () => {
    const colors = colorList(colorbrewer)

    expect(colors).toEqual(createColorList())
  })
})
