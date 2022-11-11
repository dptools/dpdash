const TOTALS_STUDY = 'Totals'

export const sortDataBySite = (dataBySite) =>
  dataBySite.sort((siteNameA, siteNameB) => {
    if (siteNameA.name === TOTALS_STUDY) {
      return -1
    }
    if (siteNameB.name === TOTALS_STUDY) {
      return 1
    }

    return siteNameA.name > siteNameB.name ? 1 : -1
  })

export const sanitizeSiteData = (siteData) =>
  siteData.filter((site) => site.totalsForStudy.count > 0)
