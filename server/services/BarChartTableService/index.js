import { N_A, SITE, TOTALS_STUDY, TOTAL_LABEL } from '../../constants'

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
    this.websiteRows = this._graphTableRowData(
      this._sortedTableRowDataBySite(),
      this.websiteColumns
    )

    return {
      tableColumns: this.websiteColumns,
      tableRows: this.websiteRows,
    }
  }

  csvTableData = () => {
    return {
      tableColumns: this.websiteColumns.map(({ name }) => name),
      tableRows: this.websiteRows.map((siteData) =>
        siteData.map(({ data }) => data)
      ),
    }
  }

  _graphTableColumns = () => [
    { name: SITE, color: 'gray' },
    ...this.labels
      .filter((column) => column.name !== N_A)
      .concat({ name: TOTAL_LABEL, color: 'gray' }),
  ]

  _graphTableRowData = (sortedGraphTableData, tableHeaders) => {
    return sortedGraphTableData.map((siteData) => {
      return tableHeaders.map(({ name: columnHeader, color }) => {
        const {
          name,
          counts: { [columnHeader]: siteCount },
          targets: { [columnHeader]: siteTarget },
        } = siteData

        return columnHeader === SITE
          ? { data: name, color }
          : {
              data: this._formatGraphTableCellData(siteTarget, siteCount),
              color,
            }
      })
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
