import { ObjectID } from 'mongodb'

import { collections } from '../utils/mongoCollections'

const TOTALS_STUDY = 'Totals'
const STUDIES_TO_OMIT = ['files', 'combined']

const studyCountsToPercentage = (studyCount, targetTotal) =>
  (100 * +studyCount) / targetTotal

const postProcessData = (data, studyTotals) => {
  const processedData = {}
  Object.entries(data).forEach((entry) => {
    const [key, count] = entry
    const [study, valueLabel, color, rawStudyTarget] = key.split('-')
    const studyTarget =
      study === TOTALS_STUDY
        ? studyTotals[TOTALS_STUDY].targetTotal
        : rawStudyTarget
    const totals = studyTotals[study].targetTotal || studyTotals[study].count
    const percent = studyCountsToPercentage(count, totals)
    const newEntry = {
      color,
      count,
      valueLabel,
      study,
      studyTarget: studyTarget === 'undefined' ? undefined : studyTarget,
      percent,
    }

    if (processedData[valueLabel]) {
      processedData[valueLabel] = processedData[valueLabel].concat(newEntry)
    } else {
      processedData[valueLabel] = [newEntry]
    }
  })

  // need the largest horizontal section so that all sites are accounted for
  const largestHorizontalSection =
    Object.values(processedData).sort(
      (arr1, arr2) => arr2.length - arr1.length
    )[0] || []

  const notAvailableArray = largestHorizontalSection.map((studySection) => {
    const totals = studyTotals[studySection.study]
    const count = totals.targetTotal ? totals.targetTotal - totals.count : 0

    return {
      color: 'grey',
      count,
      valueLabel: 'N/A',
      study: studySection.study,
      studyTarget: '',
      percent: studyCountsToPercentage(count, totals.targetTotal),
    }
  })

  if (notAvailableArray.length) {
    processedData['N/A'] = notAvailableArray
  }

  Object.keys(processedData).forEach((key) => {
    processedData[key].sort(function (studyA, studyB) {
      if (studyA.study === TOTALS_STUDY) return -1
      if (studyB.study === TOTALS_STUDY) return 1
      else return 0
    })
  })

  return processedData
}

export const graphDataController = async (dataDb, userAccess, chart_id) => {
  const data = {}
  const studyTotals = {
    [TOTALS_STUDY]: {
      count: 0,
      targetTotal: 0,
    },
  }
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

  chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
    const { targetValues } = fieldLabelValueMap

    Object.keys(targetValues).forEach((study) => {
      const rawNewTargetValue = targetValues[study]
      const newTargetValue = !!rawNewTargetValue
        ? +rawNewTargetValue
        : undefined

      if (studyTotals[study]) {
        if (studyTotals[study].targetTotal !== undefined) {
          studyTotals[study].targetTotal = !!newTargetValue
            ? studyTotals[study].targetTotal + newTargetValue
            : undefined
        }
      } else {
        studyTotals[study] = {
          count: 0,
          targetTotal: newTargetValue,
        }
      }

      if (studyTotals[TOTALS_STUDY].targetTotal !== undefined) {
        studyTotals[TOTALS_STUDY].targetTotal = !!newTargetValue
          ? studyTotals[TOTALS_STUDY].targetTotal + newTargetValue
          : undefined
      }
    })
  })

  for await (const subject of allSubjects) {
    const { study } = subject
    const subjectDayData = await dataDb
      .collection(subject.collection)
      .find({})
      .toArray()

    chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      const { color, label, value, targetValues } = fieldLabelValueMap
      const targetValue = targetValues[study]
      const hasValue = subjectDayData.some(
        (dayData) => dayData[chart.variable] == value
      )

      if (hasValue) {
        const dataKey = `${study}-${label}-${color}-${targetValue}`
        const totalsDataKey = `${TOTALS_STUDY}-${label}-${color}-undefined`

        if (data[dataKey]) {
          data[dataKey] += 1
        } else {
          data[dataKey] = 1
        }
        if (data[totalsDataKey]) {
          data[totalsDataKey] += 1
        } else {
          data[totalsDataKey] = 1
        }
        studyTotals[study].count += 1
        studyTotals[TOTALS_STUDY].count += 1
      }
    })
  }

  return {
    chart,
    data: postProcessData(data, studyTotals),
    studyTotals,
  }
}
