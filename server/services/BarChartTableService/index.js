import { NETWORK, N_A, TOTALS_STUDY, TOTAL_LABEL } from '../../constants'

const formatAsPercentage = (value = 0) => value.toFixed(0) + '%'

const studyCountsToPercentage = (studyCount, targetTotal) => {
  if (!targetTotal || Number.isNaN(+studyCount) || Number.isNaN(+targetTotal)) {
    return 0
  }

  return (+studyCount / +targetTotal) * 100
}

class BarChartTableService {
  constructor(dataBySite, labels) {
    this.dataBySite = dataBySite
    this.labels = labels
    this.websiteColumns = []
    this.websiteRows = []
  }

  websiteTableData = () => {
    this.websiteColumns = this._graphTableColumns()
    this.websiteRows = this._graphTableRowData(this._sortedTableRowDataBySite())

    return {
      tableColumns: this.websiteColumns,
      tableRows: this.websiteRows,
    }
  }

  csvTableData = () => {
    const tableColumns = this.websiteColumns.map(({ label }) => label)
    const tableRows = this.websiteRows.map((siteData) =>
      this.websiteColumns.map(({ dataProperty }) => siteData[dataProperty])
    )

    return {
      tableColumns,
      tableRows,
    }
  }

  _graphTableColumns = () => [
    {
      dataProperty: 'site',
      label: NETWORK,
      sortable: true,
    },
    ...this.labels
      .filter((column) => column.name !== N_A)
      .concat({ name: TOTAL_LABEL })
      .map(({ name }) => ({
        dataProperty: name,
        label: name,
        sortable: false,
      })),
  ]

  _graphTableRowData = (sortedGraphTableData) => {
    return sortedGraphTableData.map((siteData) => {
      return {
        site: siteData.name,
        ...Object.keys(siteData.counts).reduce((varData, nextVar) => {
          varData[nextVar] = this._formatGraphTableCellData(
            siteData.targets?.[nextVar],
            siteData.counts[nextVar]
          )

          return varData
        }, {}),
      }
    })
  }

  _formatGraphTableCellData = (siteTarget, studyCounts = 0) => {
    if (!siteTarget) return `${studyCounts}`

    const percent = studyCountsToPercentage(studyCounts, siteTarget)

    return `${studyCounts} / ${siteTarget} (${formatAsPercentage(percent)})`
  }

  _sortedTableRowDataBySite = () => {
    return this.dataBySite
      .map((site) => {
        const { count, targetTotal } = site.totalsForStudy
        site.counts[TOTAL_LABEL] = count
        site.targets[TOTAL_LABEL] = targetTotal

        return site
      })
      .sort(this._sortSitesByNameAndTotalsAtBottom)
  }

  _sortSitesByNameAndTotalsAtBottom = (siteA, siteB) => {
    if (siteA.name === TOTALS_STUDY) return 1
    if (siteB.name === TOTALS_STUDY) return -1
    if (siteA.name < siteB.name) return -1
    if (siteA.name > siteB.name) return 1

    return 0
  }
}

export default BarChartTableService
