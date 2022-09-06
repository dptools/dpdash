import { ObjectID } from 'mongodb'

import { collections } from '../utils/mongoCollections'

const TOTALS_STUDY = 'Totals'
const STUDIES_TO_OMIT = ['files', 'combined']

const studyCountsToPercentage = (studyCount, targetTotal) => {
  if (!targetTotal || Number.isNaN(+studyCount) || Number.isNaN(+targetTotal)) {
    return 0
  }

  return (+studyCount / +targetTotal) * 100
}

const postProcessData = (data, studyTotals) => {
  const processedData = {}
  Object.entries(data).forEach((entry) => {
    const [key, count] = entry
    const [study, valueLabel, color, rawStudyTarget] = key.split('-')
    const totalsForStudy = studyTotals[study]
    const studyTarget =
      study === TOTALS_STUDY
        ? studyTotals[TOTALS_STUDY].targetTotal
        : rawStudyTarget
    const totals = totalsForStudy.targetTotal || totalsForStudy.count
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
    const studySectionTotals = studyTotals[studySection.study]
    const count = studySectionTotals.targetTotal
      ? studySectionTotals.targetTotal - studySectionTotals.count
      : 0

    return {
      color: 'grey',
      count,
      valueLabel: 'N/A',
      study: studySection.study,
      studyTarget: '',
      percent: studyCountsToPercentage(
        count,
        studySectionTotals.targetTotal ?? studySectionTotals.count
      ),
    }
  })

  if (notAvailableArray.length) {
    processedData['N/A'] = notAvailableArray
  }

  // sort all processedData values in alphabetical order
  // with Totals first
  Object.keys(processedData).forEach((key) => {
    processedData[key].sort(function (studyA, studyB) {
      if (studyA.study === TOTALS_STUDY) {
        return -1
      }
      if (studyB.study === TOTALS_STUDY) {
        return 1
      }

      return studyA.study > studyB.study ? 1 : -1
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
      const dataKey = `${study}-${label}-${color}-${targetValue}`
      const totalsDataKey = `${TOTALS_STUDY}-${label}-${color}-undefined`

      if (hasValue) {
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

        if (studyTotals[study]) {
          studyTotals[study].count += 1
        } else {
          studyTotals[study] = {
            count: 1,
            targetValue,
          }
        }
        studyTotals[TOTALS_STUDY].count += 1
      } else {
        if (!data[dataKey]) {
          data[dataKey] = 0
        }
      }
    })
  }

  return {
    chart,
    data: postProcessData(data, studyTotals),
    studyTotals,
  }
}
