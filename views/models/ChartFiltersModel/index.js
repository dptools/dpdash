const ChartFiltersModel = {
  filtersToFormValues: (filters) => {
    const filterKeys = Object.keys(filters)

    return filterKeys.reduce((formValues, filterKey) => {
      formValues[filterKey] = Object.values(filters[filterKey])
        .filter(({ value }) => value === 1)
        .map(({ label }) => label)

      return formValues
    }, {})
  },
  formValuesToRequestFilters: (formValues, filters) => {
    const filterCategories = Object.keys(filters)

    return filterCategories.reduce((selectedCategories, categoryFields) => {
      selectedCategories[categoryFields] = Object.keys(
        filters[categoryFields]
      ).reduce((selectedFields, fieldKey) => {
        selectedFields[fieldKey] = {
          label: fieldKey,
          value: formValues[categoryFields].includes(fieldKey) ? 1 : 0,
        }

        return selectedFields
      }, {})

      return selectedCategories
    }, {})
  },
}

export default ChartFiltersModel
