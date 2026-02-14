import colorbrewer from 'colorbrewer'

export const colorList = (colorObj = colorbrewer) => {
  const { schemeGroups: _, ...colorBrewer } = colorObj

  return Object.values(colorBrewer)
    .flatMap((colorPalette) => Object.values(colorPalette))
    .map((colors, i) => ({ value: i, label: colors }))
}
