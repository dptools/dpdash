import { ObjectID } from 'mongodb'

import { collections } from '../utils/mongoCollections'

const postProcessData = (data) => {
  const processedData = {}

  Object.entries(data).forEach((entry) => {
    const [key, count] = entry
    const [study, valueLabel, color, studyTarget] = key.split('-')
    const newEntry = {
      color,
      count,
      valueLabel,
      study,
      studyTarget,
    }

    if (processedData[valueLabel]) {
      processedData[valueLabel] = processedData[valueLabel].concat(newEntry)
    } else {
      processedData[valueLabel] = [newEntry]
    }
  })

  return processedData
}

export const graphDataController = async (dataDb, userAccess, chart_id) => {
  const data = {}
  const chart = await dataDb
    .collection(collections.charts)
    .findOne({ _id: ObjectID(chart_id) })
  const allSubjects = await dataDb
    .collection(collections.toc)
    .find(
      { assessment: chart.assessment },
      { projection: { collection: 1, study: 1, _id: 0 } }
    )
    .toArray()

  for await (const subject of allSubjects) {
    const { study } = subject
    const subjectDayData = await dataDb
      .collection(subject.collection)
      .find({})
      .toArray()

    chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      const { color, label, value, targetValues } = fieldLabelValueMap
      const hasValue = subjectDayData.some(
        (dayData) => dayData[chart.variable] == value
      )

      if (hasValue) {
        const dataKey = `${study}-${label}-${color}-${targetValues[study]}`

        if (data[dataKey]) {
          data[dataKey] += 1
        } else {
          data[dataKey] = 1
        }
      }
    })
  }

  return {
    chart,
    data: postProcessData(data),
  }
}
