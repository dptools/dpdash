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
      const variableData = assessmentData.reduce(
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
      const max = Math.max(...variableData.map((data) => data[variable]))
      const min = Math.min(...variableData.map((data) => data[variable]))
      const sum = variableData.reduce((prev, acc) => prev + acc[variable], 0)
      const mean = sum / variableData.length
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
