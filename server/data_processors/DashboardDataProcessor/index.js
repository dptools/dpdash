class DashboardDataProcessor {
  matrixData = []

  constructor(configuration, participantDataMap) {
    this.configuration = configuration
    this.participantDataMap = participantDataMap
  }

  calculateDashboardData = () => {
    this.configuration.forEach(({ analysis, variable, label, ...rest }) => {
      const assessmentData = this.participantDataMap.get(analysis)
      if (!assessmentData)
        this.matrixData.push({
          analysis,
          data: [],
          label,
          variable,
          stat: [],
          ...rest,
        })
      else {
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
      }
    })

    return this.matrixData
  }
}

export default DashboardDataProcessor
