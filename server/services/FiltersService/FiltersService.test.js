import FiltersService, {
  DEFAULT_FILTERS,
  INDIVIDUAL_FILTERS_MONGO_PROJECTION,
} from '.'
import {
  FALSE_STRING,
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
  TRUE_STRING,
} from '../../constants'

describe(FiltersService, () => {
  describe('#filters', () => {
    const initialFilters = {
      chrcrit_part: [
        { name: 'HC', value: TRUE_STRING },
        { name: 'CHR', value: FALSE_STRING },
        { name: 'Missing', value: FALSE_STRING },
      ],
      included_excluded: [
        { name: 'Included', value: TRUE_STRING },
        { name: 'Excluded', value: FALSE_STRING },
        { name: 'Missing', value: FALSE_STRING },
      ],
      sex_at_birth: [
        { name: 'Male', value: FALSE_STRING },
        { name: 'Female', value: TRUE_STRING },
        { name: 'Missing', value: TRUE_STRING },
      ],
      sites: [],
    }
    const initialSites = ['one', 'two', 'three']

    describe('when there are filters with empty sites', () => {
      it('sanitizes the filters and sites', () => {
        const service = new FiltersService(initialFilters, initialSites)

        expect(service.filters).toEqual({
          ...initialFilters,
          sites: ['one', 'three', 'two'],
        })
      })
    })

    describe('when there are filters with existing sites', () => {
      it('sanitizes the filters and sites', () => {
        const service = new FiltersService(
          {
            ...initialFilters,
            sites: ['four', 'five', 'six'],
          },
          initialSites
        )

        expect(service.filters).toEqual({
          ...initialFilters,
          sites: ['five', 'four', 'six'],
        })
      })
    })

    describe('when there are no initial filters', () => {
      it('sanitizes the filters and sites', () => {
        const service = new FiltersService(undefined, initialSites)

        expect(service.filters).toEqual({
          ...DEFAULT_FILTERS,
          sites: ['one', 'three', 'two'],
        })
      })
    })
  })

  describe('#allFiltersInactive', () => {
    it('return true when the filters have falsey values', () => {
      const service = new FiltersService(
        {
          chrcrit_part: [{ name: 'HC', value: FALSE_STRING }],
          sites: [],
        },
        []
      )

      expect(service.allFiltersInactive()).toBe(true)
    })

    it('return false if any category filter is true', () => {
      const service = new FiltersService(
        {
          chrcrit_part: [
            { name: 'CHR', value: TRUE_STRING },
            { name: 'Missing', value: FALSE_STRING },
          ],
          sites: [],
        },
        []
      )

      expect(service.allFiltersInactive()).toBe(false)
    })
  })
})
