import {
  createChart,
  createFieldLabelValue,
  createDataBySite,
  createLabels,
  createTableHeaders,
} from '../../../test/fixtures'
import * as helpers from './helpers'
import * as helpersFactories from './testUtils'
import {
  FALSE_STRING,
  TOTALS_STUDY,
  TRUE_STRING,
  SOCIODEMOGRAPHICS_FORM,
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  STUDIES_TO_OMIT,
  N_A,
} from '../../constants'

const userAccess = ['LA', 'YA']
const INDIVIDUAL_FILTERS_MONGO_PROJECTION = {
  collection: 1,
  study: 1,
  _id: 0,
  subject: 1,
}
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
      const allowedStudies = ['MA', 'NY', 'Foo']
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

      expect(helpers.generateStudyTargetTotals(chart, allowedStudies)).toEqual({
        Madrid: { count: 0, targetTotal: 20 },
        NY: { count: 0, targetTotal: 100 },
        Foo: { count: 0, targetTotal: 8 },
        Totals: { count: 0, targetTotal: 128 },
      })
    })

    it('generates a study targets with undefined if a known site does not include a target', () => {
      const targetValues = { MA: '10', NY: '50', Foo: '' }
      const allowedStudies = ['MA', 'NY', 'Foo']
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

      expect(helpers.generateStudyTargetTotals(chart, allowedStudies)).toEqual({
        Madrid: { count: 0, targetTotal: 20 },
        NY: { count: 0, targetTotal: 100 },
        Foo: { count: 0, targetTotal: undefined },
        Totals: { count: 0, targetTotal: undefined },
      })
    })

    it('does not update totals data with new empty sites', () => {
      const targetValues = { MA: '10', NY: '50', Foo: '4' }
      const allowedStudies = ['MA', 'NY', 'Foo', 'Bar']
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

      expect(helpers.generateStudyTargetTotals(chart, allowedStudies)).toEqual({
        Madrid: { count: 0, targetTotal: 20 },
        NY: { count: 0, targetTotal: 100 },
        Foo: { count: 0, targetTotal: 8 },
        Bar: { count: 0, targetTotal: undefined },
        Totals: { count: 0, targetTotal: 128 },
      })
    })

    it('generates a study targets with undefined if a known site does not include a target and a new site is available', () => {
      const targetValues = { MA: '10', NY: '50', Foo: '' }
      const allowedStudies = ['MA', 'NY', 'Foo', 'Bar']
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

      expect(helpers.generateStudyTargetTotals(chart, allowedStudies)).toEqual({
        Madrid: { count: 0, targetTotal: 20 },
        NY: { count: 0, targetTotal: 100 },
        Foo: { count: 0, targetTotal: undefined },
        Bar: { count: 0, targetTotal: undefined },
        Totals: { count: 0, targetTotal: undefined },
      })
    })
  })

  describe(helpers.isAnyTargetIncluded, () => {
    it('returns true when all sites have target totals', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: 15 },
        NY: { count: 35, targetTotal: 35 },
        Foo: { count: 5, targetTotal: 20 },
        [TOTALS_STUDY]: { count: 50, targetTotal: 70 },
      }

      expect(helpers.isAnyTargetIncluded(studyTotals)).toBe(true)
    })

    it('returns true when one site has target totals', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: 35 },
        Foo: { count: 5, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }

      expect(helpers.isAnyTargetIncluded(studyTotals)).toBe(true)
    })

    it('returns false when no site has target totals', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: undefined },
        Foo: { count: 5, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }

      expect(helpers.isAnyTargetIncluded(studyTotals)).toBe(false)
    })
  })

  describe(helpers.postProcessData, () => {
    it('builds an object with graph data per site', () => {
      const studyTotals = {
        Madrid: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: 35 },
        Foo: { count: 5, targetTotal: 20 },
        [TOTALS_STUDY]: { count: 50, targetTotal: 70 },
      }
      const postProcessedData = helpers.postProcessData(
        helpersFactories.postProcessDataFactory({
          'Madrid-male-undefined': 5,
          'Madrid-female-10': 5,
          'NY-male-15': 10,
          'NY-female-20': 25,
          'Foo-male-10': 5,
          'Foo-female-10': 0,
          [`${TOTALS_STUDY}-male`]: 20,
          [`${TOTALS_STUDY}-female`]: 30,
        }),
        studyTotals
      )

      expect(Object.fromEntries(postProcessedData)).toEqual({
        Madrid: {
          counts: { 'N/A': 0, female: 5, male: 5 },
          name: 'Madrid',
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

    it('builds an object with graph data per site when there are only counts and no targets', () => {
      const studyTotals = {
        Madrid: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: undefined },
        Foo: { count: 5, targetTotal: undefined },
        Bar: { count: 0, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }
      const data = helpersFactories.postProcessDataFactory({
        'Madrid-male-undefined': 5,
        'Madrid-female-undefined': 5,
        'NY-male-undefined': 10,
        'NY-female-undefined': 25,
        'Foo-male-undefined': 5,
        'Foo-female-undefined': 0,
        'Bar-male-undefined': 0,
        'Bar-female-undefined': 0,
        [`${TOTALS_STUDY}-male`]: 20,
        [`${TOTALS_STUDY}-female`]: 30,
      })
      const postProcessedData = helpers.postProcessData(data, studyTotals)

      expect(Object.fromEntries(postProcessedData)).toEqual({
        Madrid: {
          counts: { 'N/A': 0, female: 5, male: 5 },
          name: 'Madrid',
          percentages: {
            'N/A': 0,
            female: 50,
            male: 50,
          },
          targets: { female: undefined, male: undefined },
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
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 35, targetTotal: undefined },
        },
        Foo: {
          counts: { 'N/A': 0, female: 0, male: 5 },
          name: 'Foo',
          percentages: { 'N/A': 0, female: 0, male: 100 },
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 5, targetTotal: undefined },
        },
        Bar: {
          name: 'Bar',
          counts: { male: 0, female: 0, 'N/A': 0 },
          totalsForStudy: { count: 0, targetTotal: undefined },
          percentages: { male: 0, female: 0, 'N/A': 0 },
          targets: { male: undefined, female: undefined },
        },
        Totals: {
          counts: { 'N/A': 0, female: 30, male: 20 },
          name: 'Totals',
          percentages: {
            'N/A': 0,
            female: 60,
            male: 40,
          },
          targets: {},
          totalsForStudy: { count: 50, targetTotal: undefined },
        },
      })
    })

    it('it replaces site abbreviation for the site name', () => {
      const studyTotals = {
        Madrid: { count: 10, targetTotal: undefined },
        Melbourne: { count: 35, targetTotal: undefined },
        Northwell: { count: 5, targetTotal: undefined },
        UNC: { count: 0, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }
      const data = helpersFactories.postProcessDataFactory({
        'Madrid-male-undefined': 5,
        'Madrid-female-undefined': 5,
        'Melbourne-male-undefined': 10,
        'Melbourne-female-undefined': 25,
        'Northwell-male-undefined': 5,
        'Northwell-female-undefined': 0,
        'UNC-male-undefined': 0,
        'UNC-female-undefined': 0,
        [`${TOTALS_STUDY}-male`]: 20,
        [`${TOTALS_STUDY}-female`]: 30,
      })
      const postProcessedData = helpers.postProcessData(data, studyTotals)

      expect(Object.fromEntries(postProcessedData)).toEqual({
        Madrid: {
          counts: { 'N/A': 0, female: 5, male: 5 },
          name: 'Madrid',
          percentages: {
            'N/A': 0,
            female: 50,
            male: 50,
          },
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 10, targetTotal: undefined },
        },
        Melbourne: {
          counts: { 'N/A': 0, female: 25, male: 10 },
          name: 'Melbourne',
          percentages: {
            'N/A': 0,
            female: 71.42857142857143,
            male: 28.57142857142857,
          },
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 35, targetTotal: undefined },
        },
        Northwell: {
          counts: { 'N/A': 0, female: 0, male: 5 },
          name: 'Northwell',
          percentages: { 'N/A': 0, female: 0, male: 100 },
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 5, targetTotal: undefined },
        },
        UNC: {
          name: 'UNC',
          counts: { male: 0, female: 0, 'N/A': 0 },
          totalsForStudy: { count: 0, targetTotal: undefined },
          percentages: { male: 0, female: 0, 'N/A': 0 },
          targets: { male: undefined, female: undefined },
        },
        Totals: {
          counts: { 'N/A': 0, female: 30, male: 20 },
          name: 'Totals',
          percentages: {
            'N/A': 0,
            female: 60,
            male: 40,
          },
          targets: {},
          totalsForStudy: { count: 50, targetTotal: undefined },
        },
      })
    })

    it('it defaults to site abbreviation if site name is not available', () => {
      const studyTotals = {
        Madrid: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: undefined },
        Foo: { count: 5, targetTotal: undefined },
        UNC: { count: 0, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }
      const data = helpersFactories.postProcessDataFactory({
        'Madrid-male-undefined': 5,
        'Madrid-female-undefined': 5,
        'NY-male-undefined': 10,
        'NY-female-undefined': 25,
        'Foo-male-undefined': 5,
        'Foo-female-undefined': 0,
        'UNC-male-undefined': 0,
        'UNC-female-undefined': 0,
        [`${TOTALS_STUDY}-male`]: 20,
        [`${TOTALS_STUDY}-female`]: 30,
      })
      const postProcessedData = helpers.postProcessData(data, studyTotals)

      expect(Object.fromEntries(postProcessedData)).toEqual({
        Madrid: {
          counts: { 'N/A': 0, female: 5, male: 5 },
          name: 'Madrid',
          percentages: {
            'N/A': 0,
            female: 50,
            male: 50,
          },
          targets: { female: undefined, male: undefined },
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
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 35, targetTotal: undefined },
        },
        Foo: {
          counts: { 'N/A': 0, female: 0, male: 5 },
          name: 'Foo',
          percentages: { 'N/A': 0, female: 0, male: 100 },
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 5, targetTotal: undefined },
        },
        UNC: {
          name: 'UNC',
          counts: { male: 0, female: 0, 'N/A': 0 },
          totalsForStudy: { count: 0, targetTotal: undefined },
          percentages: { male: 0, female: 0, 'N/A': 0 },
          targets: { male: undefined, female: undefined },
        },
        Totals: {
          counts: { 'N/A': 0, female: 30, male: 20 },
          name: 'Totals',
          percentages: {
            'N/A': 0,
            female: 60,
            male: 40,
          },
          targets: {},
          totalsForStudy: { count: 50, targetTotal: undefined },
        },
      })
    })
  })

  describe(helpers.processTotals, () => {
    it('creates a new site on studyTotals with a count and targetValue property', () => {
      const studyTotals = {
        [TOTALS_STUDY]: {
          count: 0,
          targetTotal: 0,
        },
      }
      const totalsToProcess = {
        shouldCountSubject: true,
        studyTotals,
        siteName: 'Foo',
        targetValue: 2,
        variableCount: 4,
      }
      helpers.processTotals(totalsToProcess)

      expect(studyTotals).toEqual({
        Foo: { count: 4, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 4,
          targetTotal: 0,
        },
      })
    })

    it("adds to a site's studyTotals count if subject should be counted", () => {
      const studyTotals = {
        Foo: { count: 1, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 1,
          targetTotal: 0,
        },
      }
      const totalsToProcess = {
        shouldCountSubject: true,
        studyTotals,
        siteName: 'Foo',
        targetValue: 2,
        variableCount: 3,
      }
      helpers.processTotals(totalsToProcess)

      expect(studyTotals).toEqual({
        Foo: { count: 4, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 4,
          targetTotal: 0,
        },
      })
    })

    it("does not add to a site's count if subject is not to be counted", () => {
      const studyTotals = {
        Foo: { count: 1, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 1,
          targetTotal: 0,
        },
      }
      const totalsToProcess = {
        shouldCountSubject: false,
        studyTotals,
        siteName: 'Foo',
        targetValue: 2,
      }
      helpers.processTotals(totalsToProcess)

      expect(studyTotals).toEqual({
        Foo: { count: 1, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 1,
          targetTotal: 0,
        },
      })
    })
  })

  describe(helpers.mongoQueriesFromFilters, () => {
    it('returns undefined when there are no filters', () => {
      const filters = undefined

      expect(helpers.mongoQueriesFromFilters(filters)).toBeUndefined()
    })

    it('returns an object that can be used to query mongo', () => {
      const filters = {
        chrcrit_part: [
          { name: 'HC', value: TRUE_STRING },
          { name: 'CHR', value: FALSE_STRING },
          { name: 'Missing', value: TRUE_STRING },
        ],
        included_excluded: [
          { name: 'Included', value: FALSE_STRING },
          { name: 'Excluded', value: TRUE_STRING },
          { name: 'Missing', value: FALSE_STRING },
        ],
        sex_at_birth: [
          { name: 'Male', value: TRUE_STRING },
          { name: 'Female', value: TRUE_STRING },
          { name: 'Missing', value: TRUE_STRING },
        ],
      }

      expect(helpers.mongoQueriesFromFilters(filters, userAccess)).toEqual({
        mongoAggregateQueryForIncludedCriteria: [
          {
            $facet: {
              chrcrit_part: [
                {
                  $match: {
                    chrcrit_part: {
                      $in: [2, ''],
                    },
                  },
                },
              ],
              included_excluded: [
                {
                  $match: {
                    included_excluded: {
                      $in: [0],
                    },
                  },
                },
              ],
            },
          },
        ],
        activeFilters: ['chrcrit_part', 'included_excluded', 'sex_at_birth'],
        mongoAggregateQueryForFilters: [
          {
            $facet: {
              inclusionCriteria: [
                {
                  $match: {
                    assessment: 'form_inclusionexclusion_criteria_review',
                    study: {
                      $in: userAccess,
                      $nin: ['files', 'combined'],
                    },
                  },
                },
                {
                  $project: {
                    ...INDIVIDUAL_FILTERS_MONGO_PROJECTION,
                  },
                },
                {
                  $addFields: {
                    filter: INCLUSION_EXCLUSION_CRITERIA_FORM,
                  },
                },
              ],
              socioDemographics: [
                {
                  $match: {
                    assessment: 'form_sociodemographics',
                    study: {
                      $in: userAccess,
                      $nin: ['files', 'combined'],
                    },
                  },
                },
                {
                  $project: {
                    ...INDIVIDUAL_FILTERS_MONGO_PROJECTION,
                  },
                },
                {
                  $addFields: {
                    filter: SOCIODEMOGRAPHICS_FORM,
                  },
                },
              ],
            },
          },
        ],
        mongoQueryForSocioDemographics: {
          chrdemo_sexassigned: {
            $in: [1, 2, ''],
          },
        },
      })
    })

    it('returns an object with individual criterias that can be used to query mongo', () => {
      const filters = {
        chrcrit_part: [
          { name: 'HC', value: TRUE_STRING },
          { name: 'CHR', value: FALSE_STRING },
          { name: 'Missing', value: TRUE_STRING },
        ],
        included_excluded: [
          { name: 'Included', value: FALSE_STRING },
          { name: 'Excluded', value: FALSE_STRING },
          { name: 'Missing', value: FALSE_STRING },
        ],
        sex_at_birth: [
          { name: 'Male', value: FALSE_STRING },
          { name: 'Female', value: FALSE_STRING },
          { name: 'Missing', value: FALSE_STRING },
        ],
      }

      expect(helpers.mongoQueriesFromFilters(filters, userAccess)).toEqual({
        mongoAggregateQueryForIncludedCriteria: [
          {
            $facet: {
              chrcrit_part: [
                {
                  $match: {
                    chrcrit_part: {
                      $in: [2, ''],
                    },
                  },
                },
              ],
            },
          },
        ],
        activeFilters: ['chrcrit_part'],
        mongoAggregateQueryForFilters: [
          {
            $facet: {
              inclusionCriteria: [
                {
                  $match: {
                    assessment: 'form_inclusionexclusion_criteria_review',
                    study: {
                      $in: ['LA', 'YA'],
                      $nin: ['files', 'combined'],
                    },
                  },
                },
                {
                  $project: {
                    ...INDIVIDUAL_FILTERS_MONGO_PROJECTION,
                  },
                },
                {
                  $addFields: {
                    filter: INCLUSION_EXCLUSION_CRITERIA_FORM,
                  },
                },
              ],
            },
          },
        ],
        mongoQueryForSocioDemographics: {
          chrdemo_sexassigned: {
            $in: [],
          },
        },
      })
    })
  })

  describe(helpers.calculateSubjectVariableDayCount, () => {
    it('returns the number of times a variable value occurrs in a subjects data', () => {
      const subjectAssessmentData = [
        { day: 1, sex: 'male' },
        { day: 2, sex: 'male' },
        { day: 3, sex: 'male' },
        { day: 4, sex: 'female' },
      ]
      const variable = 'sex'
      const value = 'male'

      expect(
        helpers.calculateSubjectVariableDayCount(
          subjectAssessmentData,
          variable,
          value
        )
      ).toEqual(3)
    })

    it("returns the number of times any variable and it's value appear in subject's data when value is a string number", () => {
      const subjectAssessmentData = [
        {
          day: 1,
          MRI: 1,
        },
        { day: 2, MRI: 1 },
        { day: 3, MRI: 2 },
        { day: 4, MRI: 5 },
      ]
      const variable = 'MRI'
      const value = '1'

      expect(
        helpers.calculateSubjectVariableDayCount(
          subjectAssessmentData,
          variable,
          value
        )
      ).toEqual(2)
    })
  })

  describe(helpers.buildFacetForFilters, () => {
    it('returns an object to create lists for the requested filters', () => {
      expect(
        helpers.buildFacetForFilters({
          isSexAtBirthFilterActive: true,
          isInclusionCriteriaFilterActive: true,
          userAccess,
        })
      ).toEqual({
        socioDemographics: [
          {
            $match: {
              assessment: SOCIODEMOGRAPHICS_FORM,
              study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
            },
          },
          {
            $project: {
              ...INDIVIDUAL_FILTERS_MONGO_PROJECTION,
            },
          },
          {
            $addFields: {
              filter: SOCIODEMOGRAPHICS_FORM,
            },
          },
        ],
        inclusionCriteria: [
          {
            $match: {
              assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
              study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
            },
          },
          {
            $project: {
              ...INDIVIDUAL_FILTERS_MONGO_PROJECTION,
            },
          },
          {
            $addFields: {
              filter: INCLUSION_EXCLUSION_CRITERIA_FORM,
            },
          },
        ],
      })
    })

    it('returns an object only for the requested filters', () => {
      expect(
        helpers.buildFacetForFilters({
          isSexAtBirthFilterActive: true,
          isInclusionCriteriaFilterActive: undefined,
          userAccess,
        })
      ).toEqual({
        socioDemographics: [
          {
            $match: {
              assessment: SOCIODEMOGRAPHICS_FORM,
              study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
            },
          },
          {
            $project: {
              ...INDIVIDUAL_FILTERS_MONGO_PROJECTION,
            },
          },
          {
            $addFields: {
              filter: SOCIODEMOGRAPHICS_FORM,
            },
          },
        ],
      })
    })
  })

  describe(helpers.intersectSubjectsFromFilters, () => {
    it('returns a map with subject data merged', () => {
      const requestedFilters = {
        socioDemographics: [
          {
            study: 'YA',
            subject: 'YA01508',
            collection:
              '99fc2c55c6718fcd8eadf9244a24d2f68aae77c6fc591d5e2a8e67bab906446f',
            filter: SOCIODEMOGRAPHICS_FORM,
          },
          {
            study: 'CA',
            subject: 'CA00063',
            collection: 'CA00063filter',
            filter: SOCIODEMOGRAPHICS_FORM,
          },
        ],
        inclusionCriteria: [
          {
            study: 'YA',
            subject: 'YA01508',
            collection:
              '062419c48a8b6634e696b9dc0674fb87c34aea44751d1eba107feb0fc7325d71',
            filter: INCLUSION_EXCLUSION_CRITERIA_FORM,
          },
          {
            study: 'CA',
            subject: 'CA00063',
            collection: 'CA00063filter',
            filter: INCLUSION_EXCLUSION_CRITERIA_FORM,
          },
          {
            study: 'LA',
            subject: 'LA00028',
            collection: 'la00028filter',
            filter: INCLUSION_EXCLUSION_CRITERIA_FORM,
          },
          {
            study: 'YA',
            subject: 'YA00015',
            collection: 'YA00015Filter',
            filter: INCLUSION_EXCLUSION_CRITERIA_FORM,
          },
        ],
        thirdCriteriaFilter: [
          {
            study: 'YA',
            subject: 'YA01508',
            collection: 'thirdCriteriaFilterCollection',
            filter: 'thirdCriteria',
          },
        ],
      }
      const intersectedSubjectsMap = Array.from(
        helpers.intersectSubjectsFromFilters(requestedFilters)
      )

      expect(intersectedSubjectsMap).toEqual([
        [
          'YA01508',
          [
            {
              collection:
                '99fc2c55c6718fcd8eadf9244a24d2f68aae77c6fc591d5e2a8e67bab906446f',
              filter: SOCIODEMOGRAPHICS_FORM,
            },
            {
              collection:
                '062419c48a8b6634e696b9dc0674fb87c34aea44751d1eba107feb0fc7325d71',
              filter: INCLUSION_EXCLUSION_CRITERIA_FORM,
            },
            {
              collection: 'thirdCriteriaFilterCollection',
              filter: 'thirdCriteria',
            },
          ],
        ],
      ])
    })
  })

  describe(helpers.graphTableColumns, () => {
    it('returns an array of graph table headers from a list of labels', () => {
      expect(helpers.graphTableColumns(createLabels())).toEqual([
        {
          color: 'gray',
          name: 'Site',
        },
        {
          color: '#b1b1b1',
          name: 'Pending evaluation',
        },
        {
          color: '#7AAA7B',
          name: 'Excellent',
        },
        {
          color: '#97C0CE',
          name: 'Good',
        },
        {
          color: '#FFD700',
          name: 'Average',
        },
        {
          color: '#F89235',
          name: 'Poor',
        },
        {
          color: 'gray',
          name: 'Total',
        },
      ])
    })

    it('removes the N/A category from the labels list', () => {
      const isNAValueInArray = helpers
        .graphTableColumns(
          createLabels([
            {
              name: N_A,
              color: 'grey',
            },
          ])
        )
        .some(({ name }) => name === N_A)
      expect(isNAValueInArray).toEqual(false)
    })

    it('appends the header "Total" to array', () => {
      const total = helpers.graphTableColumns(createLabels()).pop()
      expect(total).toEqual({ color: 'gray', name: 'Total' })
    })
  })

  describe(helpers.graphTableRowData, () => {
    it('returns sorted graph table row data', () => {
      expect(
        helpers.graphTableRowData(
          helpers.sortTableRowDataBySite(createDataBySite()),
          createTableHeaders()
        )
      ).toEqual([
        [
          {
            color: 'gray',
            data: 'Totals',
          },
          {
            data: '60 / 215 (28%)',
            color: '#b1b1b1',
          },
          {
            data: '87 / 215 (40%)',
            color: '#7AAA7B',
          },
          {
            data: '40 / 215 (19%)',
            color: '#97C0CE',
          },
          {
            data: '26 / 215 (12%)',
            color: '#FFD700',
          },
          {
            data: '2 / 215 (1%)',
            color: '#F89235',
          },
          {
            data: '215',
            color: 'gray',
          },
        ],
        [
          {
            color: 'gray',
            data: 'Birmingham',
          },
          {
            data: '2',
            color: '#b1b1b1',
          },
          {
            data: '0',
            color: '#7AAA7B',
          },
          {
            data: '0',
            color: '#97C0CE',
          },
          {
            data: '0',
            color: '#FFD700',
          },
          {
            data: '0',
            color: '#F89235',
          },
          {
            data: '2',
            color: 'gray',
          },
        ],
        [
          {
            color: 'gray',
            data: 'Calgary',
          },
          {
            data: '3',
            color: '#b1b1b1',
          },
          {
            data: '2',
            color: '#7AAA7B',
          },
          {
            data: '0',
            color: '#97C0CE',
          },
          {
            data: '1',
            color: '#FFD700',
          },
          {
            data: '0',
            color: '#F89235',
          },
          {
            data: '6',
            color: 'gray',
          },
        ],
        [
          {
            color: 'gray',
            data: 'Cambridge UK',
          },
          {
            data: '1',
            color: '#b1b1b1',
          },
          {
            data: '0',
            color: '#7AAA7B',
          },
          {
            data: '1',
            color: '#97C0CE',
          },
          {
            data: '0',
            color: '#FFD700',
          },
          {
            data: '0',
            color: '#F89235',
          },
          {
            data: '2',
            color: 'gray',
          },
        ],
      ])
    })
  })
})
