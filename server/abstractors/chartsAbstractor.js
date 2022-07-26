export const legend = (fieldValues) => fieldValues
.map(({fieldLabelValueMap: { label, color }}) => ({ 
  name: label, 
  symbol: { 
    type: 'square',
    fill: color
  }
}))

export const chartVariableColors = (fieldValues) => fieldValues.map(({ fieldLabelValueMap: { color }}) => color)

export const groupTargetValuesByFieldValues = (fieldValues) => fieldValues
.reduce((currentGroup, nextGroup) => {
  currentGroup[nextGroup.fieldLabelValueMap.label] = nextGroup.fieldLabelValueMap
    .targetValues
      .reduce((currentSites, nextSites) => {
        currentSites[nextSites.site] = { value: nextSites.value }

        return currentSites
      }, {})

  return currentGroup
}, {})

export const chartDataAbstractor = (individualCountsList) => Object
.values(individualCountsList
.reduce(function (currentSiteData, nextSiteData) {
  currentSiteData[nextSiteData.fieldLabel] = currentSiteData[nextSiteData.fieldLabel] || [];
  currentSiteData[nextSiteData.fieldLabel].push(nextSiteData);

  return currentSiteData;
}, {}))
.map((groupedCounts) => 
  Object
  .values(groupedCounts
    .reduce((currentSite, nextSite) => {
      currentSite[nextSite.siteName] = currentSite[nextSite.siteName]
      ? { ...nextSite, count: nextSite.count + currentSite[nextSite.siteName].count }
      : nextSite;

      return currentSite;
    }, {}))
)
