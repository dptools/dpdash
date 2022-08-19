import { ObjectID } from 'mongodb'

import { collections } from '../utils/mongoCollections'

const Totals = 'Totals'

const studyCountsToPercentage = (studyCount, targetTotal) =>
  (100 * +studyCount) / targetTotal

const postProcessData = (data, studyTotals) => {
  const processedData = {}
  Object.entries(data).forEach((entry) => {
    const [key, count] = entry
    const [study, valueLabel, color, studyTarget] = key.split('-')
    const totals = studyTotals[study].targetTotal || studyTotals[study].count
    const percent = studyCountsToPercentage(count, totals)
    const newEntry = {
      color,
      count,
      valueLabel,
      study,
      studyTarget,
      percent,
    }

    if (processedData[valueLabel]) {
      processedData[valueLabel] = processedData[valueLabel].concat(newEntry)
    } else {
      processedData[valueLabel] = [newEntry]
    }
  })

  // need the largest horizontal section so that all sites are accounted for
  const largestHorizontalSection = Object.values(processedData).sort(
    (arr1, arr2) => arr2.length - arr1.length
  )[0]

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

  processedData['N/A'] = notAvailableArray
  Object.keys(processedData).forEach((key) => {
    processedData[key].sort(function (studyA, studyB) {
      return studyA.study === Totals ? -1 : studyB.study === Totals ? 1 : 0
    })
  })
  return processedData
}

export const graphDataController = async (dataDb, userAccess, chart_id) => {
  const data = {}
  const studyTotals = {
    [Totals]: {
      count: 0,
      targetTotal: undefined,
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
        study: { $in: userAccess, $not: { $eq: ['files', 'combined'] } },
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
        if (!!studyTotals[study].targetTotal) {
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
        const totalsDataKey = `${Totals}-${label}-${color}-undefined`

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
        studyTotals[Totals].count += 1
      }
    })
  }

  return {
    chart,
    data: postProcessData(data, studyTotals),
    studyTotals,
  }
}
