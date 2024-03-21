import { DISALLOWED_STUDIES } from '../../constants'

const allowedStudies = (study) => !DISALLOWED_STUDIES.includes(study)

export const targetValuesFields = (studyList) =>
  studyList.filter(allowedStudies).reduce((targets, study) => {
    targets[study] = ''
    return targets
  }, {})
