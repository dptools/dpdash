import * as barGraphHelpers from './helpers'

describe('BarGraph - helpers', () => {
  describe(barGraphHelpers.sortDataBySite, () => {
    it('sorts site data by name alphabetically', () => {
      const dataBySite = [
        {
          name: 'CA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'YA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'LA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'ProNET',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'MA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
      ]

      expect(barGraphHelpers.sortDataBySite(dataBySite)).toEqual([
        {
          name: 'CA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'LA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'MA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'ProNET',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'YA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
      ])
    })

    it('places Totals first and then sorts site data by name alphabetically', () => {
      const dataBySite = [
        {
          name: 'CA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'YA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'LA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'Totals',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'ProNET',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'MA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
      ]

      expect(barGraphHelpers.sortDataBySite(dataBySite)).toEqual([
        {
          name: 'Totals',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'CA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'LA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'MA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'ProNET',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
        {
          name: 'YA',
          counts: {},
          targets: {},
          totalsForStudy: {},
        },
      ])
    })
  })

  describe(barGraphHelpers.sanitizeSiteData, () => {
    it('filters site that have total count data', () => {
      const dataBySite = [
        {
          name: 'CA',
          counts: {},
          targets: {},
          totalsForStudy: { count: 4 },
        },
        {
          name: 'YA',
          counts: {},
          targets: {},
          totalsForStudy: { count: 0 },
        },
        {
          name: 'LA',
          counts: {},
          targets: {},
          totalsForStudy: { count: 3 },
        },
        {
          name: 'ProNET',
          counts: {},
          targets: {},
          totalsForStudy: { count: 5 },
        },
        {
          name: 'MA',
          counts: {},
          targets: {},
          totalsForStudy: { count: 0 },
        },
      ]

      expect(barGraphHelpers.sanitizeSiteData(dataBySite)).toEqual([
        {
          name: 'CA',
          counts: {},
          targets: {},
          totalsForStudy: { count: 4 },
        },
        {
          name: 'LA',
          counts: {},
          targets: {},
          totalsForStudy: { count: 3 },
        },
        {
          name: 'ProNET',
          counts: {},
          targets: {},
          totalsForStudy: { count: 5 },
        },
      ])
    })
  })
})
