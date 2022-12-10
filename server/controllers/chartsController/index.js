import { ObjectID } from 'mongodb'

import { collections } from '../../utils/mongoCollections'
import { SITE_NAMES } from '../../utils/siteNames'
import {
  generateStudyTargetTotals,
  isAnyTargetIncluded,
  N_A,
  postProcessData,
  processData,
  processTotals,
  TOTALS_STUDY,
} from './helpers'

const STUDIES_TO_OMIT = ['files', 'combined']

export const graphDataController = async (dataDb, userAccess, chart_id) => {
  const labelMap = new Map()
  const dataMap = new Map()
  const chart = await dataDb
    .collection(collections.charts)
    .findOne({ _id: ObjectID(chart_id) })
  const allSubjects = await dataDb
    .collection(collections.toc)
    .find(
      {
        assessment: chart.assessment,
        study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
      },
      { projection: { collection: 1, study: 1, _id: 0 } }
    )
    .toArray()

  const allowedStudies = userAccess.filter(
    (study) => !STUDIES_TO_OMIT.includes(study)
  )
  const studyTotals = generateStudyTargetTotals(chart, allowedStudies)

  for await (const subject of allSubjects) {
    const { study } = subject
    const subjectDayData = await dataDb
      .collection(subject.collection)
      .find({})
      .toArray()

    chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      const { color, label, value, targetValues } = fieldLabelValueMap
      const targetValue = targetValues[study]
      const siteName = SITE_NAMES[study] || study
      const dataKey = `${siteName}-${label}-${targetValue}`
      const totalsDataKey = `${TOTALS_STUDY}-${label}`
      const isVariableValueEmpty = value === ''
      const shouldCountSubject = isVariableValueEmpty
        ? subjectDayData.every((day) => day[chart.variable] === value)
        : subjectDayData.some((dayData) => dayData[chart.variable] == value)

      labelMap.set(label, { name: label, color })
      processData({ shouldCountSubject, dataMap, dataKey, totalsDataKey })
      processTotals({
        shouldCountSubject,
        studyTotals,
        siteName,
        targetValue,
      })
    })
  }

  const dataBySite = postProcessData(dataMap, studyTotals)

  if (isAnyTargetIncluded(studyTotals)) {
    labelMap.set(N_A, { name: N_A, color: '#808080' })
  }

  return {
    chart,
    dataBySite: Array.from(dataBySite.values()),
    labels: Array.from(labelMap.values()),
    studyTotals,
  }
}
