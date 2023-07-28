import _ from 'lodash'
import CollectionsModel from '../../models/CollectionsModel'

class DashboardDataProcessor {
  #configDataMap = new Map()
  #assessmentsFromConfig

  constructor(assessmentsFromConfig, configuration, db) {
    this.#assessmentsFromConfig = assessmentsFromConfig
    this.configuration = configuration
    this.db = db
    this.matrixData = []
  }

  #dataFromAssessments = async () =>
    await Promise.all(
      this.#assessmentsFromConfig.map(async ({ collection, assessment }) => {
        const data = await CollectionsModel.all(this.db, collection)

        this.#configDataMap.set(assessment, data)
      })
    )

  calculateDashboardData = async () => {
    await this.#dataFromAssessments()

    this.configuration.forEach(({ analysis, variable, label, ...rest }) => {
      const assessmentData = this.#configDataMap.get(analysis)
      const variableData = _.reduce(
        assessmentData,
        (variableDataArray, dayData) => {
          if (Object.hasOwn(dayData, variable))
            variableDataArray.push({
              day: dayData.day,
              [variable]: dayData[variable],
            })

          return variableDataArray
        },
        []
      )

      const max = _.maxBy(variableData, variable)?.[variable]
      const min = _.minBy(variableData, variable)?.[variable]
      const mean = _.meanBy(variableData, variable)
      const stat = [{ max, min, mean }]

      this.matrixData.push({
        analysis,
        data: variableData,
        label,
        variable,
        stat: variableData.length ? stat : [],
        ...rest,
      })
    })

    return { matrixData: this.matrixData }
  }
}

export default DashboardDataProcessor
