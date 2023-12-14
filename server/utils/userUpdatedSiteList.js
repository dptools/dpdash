const DISALLOWED_STUDIES = ['combined', 'files', 'ProNet']
const allowedStudies = (study) => !DISALLOWED_STUDIES.includes(study)

export const recentStudyList = (studyList) =>
  studyList.filter(allowedStudies).reduce((targets, study) => {
    targets[study] = ''
    return targets
  }, {})
