const DISALLOWED_STUDIES = ['combined', 'files']
const allowedStudies = (study) => !DISALLOWED_STUDIES.includes(study)

export const defaultTargetValueMap = (studyList) =>
  studyList.filter(allowedStudies).reduce((targets, study) => {
    targets[study] = ''
    return targets
  }, {})
