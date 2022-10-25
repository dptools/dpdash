import { createChart, createFieldLabelValue } from '../../../test/fixtures'
import * as helpers from './helpers'

describe('chartsController - helpers', () => {
  describe(helpers.studyTargetTotal, () => {
    describe('when there are totals for the study', () => {
      describe('when the target total is undefined', () => {
        const newTargetValue = 10
        const studyTotals = {
          targetTotal: undefined,
          count: 0,
        }

        it('returns the existing study totals', () => {
          expect(helpers.studyTargetTotal(studyTotals, newTargetValue)).toBe(
            studyTotals
          )
        })
      })

      describe('when there is a target total', () => {
        const studyTotals = {
          targetTotal: 100,
          count: 0,
        }

        describe('when the new target value is defined', () => {
          const newTargetValue = 10

          it('adds the new target value to the existing target total', () => {
            expect(
              helpers.studyTargetTotal(studyTotals, newTargetValue)
            ).toEqual({ ...studyTotals, targetTotal: 110 })
          })
        })

        describe('when the new target value is not defined', () => {
          const newTargetValue = undefined

          it('sets the target total to "undefined"', () => {
            expect(
              helpers.studyTargetTotal(studyTotals, newTargetValue)
            ).toEqual({ ...studyTotals, targetTotal: undefined })
          })
        })
      })
    })

    describe('when there are no totals for the study', () => {
      it('returns a study totals object with a count of 0 and target value', () => {
        const newTargetValue = 10
        const studyTotals = undefined

        expect(helpers.studyTargetTotal(studyTotals, newTargetValue)).toEqual({
          count: 0,
          targetTotal: newTargetValue,
        })
      })
    })
  })

  describe(helpers.totalStudyTargetValue, () => {
    describe('when the total study target value is undefined', () => {
      const totalsStudyTargetTotal = undefined

      it('returns undefined', () => {
        const siteTargetValue = 10

        expect(
          helpers.totalStudyTargetValue(totalsStudyTargetTotal, siteTargetValue)
        ).toBe(undefined)
      })
    })

    describe('when there is a total study target value', () => {
      const totalsStudyTargetTotal = 100

      describe('when there is a site target value', () => {
        const siteTargetValue = 10

        it('returns the sum of the existing total target value and the new site value', () => {
          expect(
            helpers.totalStudyTargetValue(
              totalsStudyTargetTotal,
              siteTargetValue
            )
          ).toBe(110)
        })
      })

      describe('when the site target value is undefined', () => {
        const siteTargetValue = undefined

        it('returns the sum of the existing total target value and the new site value', () => {
          expect(
            helpers.totalStudyTargetValue(
              totalsStudyTargetTotal,
              siteTargetValue
            )
          ).toBe(undefined)
        })
      })
    })
  })

  describe(helpers.generateStudyTargetTotals, () => {
    it('generates a study targets object for all sites and the totals site', () => {
      const targetValues = { MA: '10', NY: '50', Foo: '4' }
      const chart = createChart({
        fieldLabelValueMap: [
          createFieldLabelValue({
            value: 'valueA',
            label: 'labelA',
            targetValues,
          }),
          createFieldLabelValue({
            value: 'valueB',
            label: 'labelB',
            targetValues,
          }),
        ],
      })

      expect(helpers.generateStudyTargetTotals(chart)).toEqual({
        MA: { count: 0, targetTotal: 20 },
        NY: { count: 0, targetTotal: 100 },
        Foo: { count: 0, targetTotal: 8 },
        Totals: { count: 0, targetTotal: 128 },
      })
    })
  })

  describe(helpers.isAnyTargetIncluded, () => {
    it('returns true when all sites have target totals', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: 15 },
        NY: { count: 35, targetTotal: 35 },
        Foo: { count: 5, targetTotal: 20 },
        [helpers.TOTALS_STUDY]: { count: 50, targetTotal: 70 },
      }

      expect(helpers.isAnyTargetIncluded(studyTotals)).toBe(true)
    })

    it('returns true when one site has target totals', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: 35 },
        Foo: { count: 5, targetTotal: undefined },
        [helpers.TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }

      expect(helpers.isAnyTargetIncluded(studyTotals)).toBe(true)
    })

    it('returns false when no site has target totals', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: undefined },
        Foo: { count: 5, targetTotal: undefined },
        [helpers.TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }

      expect(helpers.isAnyTargetIncluded(studyTotals)).toBe(false)
    })
  })

  describe(helpers.postProcessData, () => {
    it('builds an object with graph data per site', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: 35 },
        Foo: { count: 5, targetTotal: 20 },
        [helpers.TOTALS_STUDY]: { count: 50, targetTotal: 70 },
      }
      const data = new Map([
        ['MA-male-undefined', 5],
        ['MA-female-10', 5],
        ['NY-male-15', 10],
        ['NY-female-20', 25],
        ['Foo-male-10', 5],
        ['Foo-female-10', 0],
        [`${helpers.TOTALS_STUDY}-male`, 20],
        [`${helpers.TOTALS_STUDY}-female`, 30],
      ])

      const postProcessedData = helpers.postProcessData(data, studyTotals)

      expect(Object.fromEntries(postProcessedData)).toEqual({
        MA: {
          counts: { 'N/A': 0, female: 5, male: 5 },
          name: 'MA',
          percentages: {
            'N/A': 0,
            female: 50,
            male: 50,
          },
          targets: { female: 10, male: undefined },
          totalsForStudy: { count: 10, targetTotal: undefined },
        },
        NY: {
          counts: { 'N/A': 0, female: 25, male: 10 },
          name: 'NY',
          percentages: {
            'N/A': 0,
            female: 71.42857142857143,
            male: 28.57142857142857,
          },
          targets: { female: 20, male: 15 },
          totalsForStudy: { count: 35, targetTotal: 35 },
        },
        Foo: {
          counts: { 'N/A': 15, female: 0, male: 5 },
          name: 'Foo',
          percentages: { 'N/A': 75, female: 0, male: 25 },
          targets: { female: 10, male: 10 },
          totalsForStudy: { count: 5, targetTotal: 20 },
        },
        Totals: {
          counts: { 'N/A': 20, female: 30, male: 20 },
          name: 'Totals',
          percentages: {
            'N/A': 28.57142857142857,
            female: 42.857142857142854,
            male: 28.57142857142857,
          },
          targets: { female: 40, male: 25 },
          totalsForStudy: { count: 50, targetTotal: 70 },
        },
      })
    })
  })
})
