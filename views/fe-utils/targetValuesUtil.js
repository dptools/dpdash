export const targetValuesFields = (studyList) =>
  studyList?.reduce((targets, study) => {
    targets[study] = ''
    return targets
  }, {})
