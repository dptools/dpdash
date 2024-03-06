import FiltersService, { DEFAULT_FILTERS } from '.'

describe(FiltersService, () => {
  describe('#filters', () => {
    const initialFilters = {
      chrcrit_part: {
        HC: { label: 'HC', value: 1 },
        CHR: { label: 'CHR', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      },
      included_excluded: {
        Included: { label: 'Included', value: 1 },
        Excluded: { label: 'Excluded', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      },
      sex_at_birth: {
        Male: { label: 'Male', value: 0 },
        Female: { label: 'Female', value: 1 },
        Missing: { label: 'Missing', value: 1 },
      },
      sites: {},
    }
    const initialSites = ['one', 'two', 'three']

    describe('when there are filters with empty sites', () => {
      it('sanitizes the filters and sites', () => {
        const service = new FiltersService(initialFilters, initialSites)

        expect(service.filters).toEqual({
          ...initialFilters,
          sites: {},
        })
      })
    })

    describe('when there are filters with existing sites', () => {
      it('sanitizes the filters and sites', () => {
        const service = new FiltersService(
          {
            ...initialFilters,
            sites: {
              one: {
                label: 'one',
                value: 1,
              },
              three: {
                label: 'three',
                value: 1,
              },
              two: {
                label: 'two',
                value: 1,
              },
            },
          },
          initialSites
        )

        expect(service.filters).toEqual({
          ...initialFilters,
          sites: {
            one: {
              label: 'one',
              value: 1,
            },
            three: {
              label: 'three',
              value: 1,
            },
            two: {
              label: 'two',
              value: 1,
            },
          },
        })
      })
    })

    describe('when there are no initial filters', () => {
      it('sanitizes the filters and sites', () => {
        const service = new FiltersService(undefined, initialSites)

        expect(service.filters).toEqual({
          ...DEFAULT_FILTERS,
          sites: {
            one: {
              label: 'one',
              value: 1,
            },
            three: {
              label: 'three',
              value: 1,
            },
            two: {
              label: 'two',
              value: 1,
            },
          },
        })
      })
    })
  })

  describe('#allFiltersInactive', () => {
    it('return true when the filters have falsey values', () => {
      const service = new FiltersService(
        {
          chrcrit_part: [{ name: 'HC', value: 0 }],
          sites: {},
        },
        []
      )

      expect(service.allFiltersInactive()).toBe(true)
    })

    it('return false if any category filter is true', () => {
      const service = new FiltersService(
        {
          chrcrit_part: [
            { name: 'CHR', value: 1 },
            { name: 'Missing', value: 0 },
          ],
          sites: {},
        },
        []
      )

      expect(service.allFiltersInactive()).toBe(false)
    })
  })
})
