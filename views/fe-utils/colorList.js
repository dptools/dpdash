import colorbrewer from 'colorbrewer'
import _ from 'lodash'

const schemaGroups = 'schemeGroups'

export const colorList = (colorObj = colorbrewer) => {
  return _(colorObj)
    .omit(schemaGroups)
    .values()
    .map(_.values)
    .flatten()
    .map((colors, i) => ({ value: i, label: colors }))
    .value()
}
