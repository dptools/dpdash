import * as helpers from './helpers'

describe('BarGraphTooltip Helpers', () => {
  describe(helpers.formatTooltipData, () => {
    it('returns the site count value if no site targets', () => {
      const tooltipValueColumn = helpers.formatTooltipData(4)
      expect(tooltipValueColumn).toEqual('4')
    })

    it('returns the site count and site target', () => {
      const tooltipValueColumn = helpers.formatTooltipData(4, 5)
      expect(tooltipValueColumn).toEqual('4 / 5')
    })
  })

  describe(helpers.formatTotalsTooltipData, () => {
    it('returns the site count if no site target total', () => {
      const chartTotals = {
        siteCount: 344,
      }
      const tooltipValueColumn = helpers.formatTotalsTooltipData(
        chartTotals,
        false
      )

      expect(tooltipValueColumn).toEqual('344')
    })

    it('returns the site count and site target total when all sites have targets set', () => {
      const chartTotals = {
        siteCount: 344,
        siteTarget: 555,
        shouldDisplayTargets: true,
      }
      const tooltipValueColumn = helpers.formatTotalsTooltipData(chartTotals)

      expect(tooltipValueColumn).toEqual('344 / 555')
    })
  })

  describe(helpers.siteTooltipContent, () => {
    it('returns an array of columns and rows', () => {
      const siteData = [
        {
          name: 'A',
          payload: {
            name: 'Totals',
            counts: {
              A: 13,
              B: 7,
              'N/A': 0,
              Total: 20,
            },
            targets: {
              A: 20,
              B: 20,
            },
          },
        },
        {
          name: 'B',
          payload: {
            name: 'Totals',
            counts: {
              A: 13,
              B: 7,
              'N/A': 0,
              Total: 20,
            },
            totalsForStudy: {
              count: 20,
            },
            percentages: {
              A: 65,
              B: 35,
              'N/A': 0,
            },
            targets: {
              A: 20,
              B: 20,
            },
          },
        },
      ]
      const siteTotals = { count: 20 }
      const tooltipContent = helpers.siteTooltipContent(siteData, siteTotals)

      expect(tooltipContent).toEqual([
        { labelColumn: 'A', valueColumn: '13' },
        { labelColumn: 'B', valueColumn: '7' },
        { labelColumn: 'Total', valueColumn: '20' },
      ])
    })

    it('returns an array of columns and rows with targets', () => {
      const siteData = [
        {
          name: 'A',
          payload: {
            name: 'Yale',
            counts: {
              A: 13,
              B: 7,
              'N/A': 0,
              Total: 20,
            },
            targets: {
              A: 20,
              B: 20,
            },
          },
        },
        {
          name: 'B',
          payload: {
            name: 'Yale',
            counts: {
              A: 13,
              B: 7,
              'N/A': 0,
              Total: 20,
            },
            totalsForStudy: {
              count: 20,
            },
            percentages: {
              A: 65,
              B: 35,
              'N/A': 0,
            },
            targets: {
              A: 20,
              B: 20,
              Total: 30,
            },
          },
        },
      ]
      const siteTotals = { count: 20, targetTotal: 50 }
      const tooltipContent = helpers.siteTooltipContent(siteData, siteTotals)

      expect(tooltipContent).toEqual([
        { labelColumn: 'A', valueColumn: '13 / 20' },
        { labelColumn: 'B', valueColumn: '7 / 20' },
        { labelColumn: 'Total', valueColumn: '20 / 50' },
      ])
    })
  })
})
