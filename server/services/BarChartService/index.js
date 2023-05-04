import { STUDIES_TO_OMIT, TOTALS_STUDY } from '../../constants'
import BarChartDataProcessor from '../../data_processors/BarChartDataProcessor'
import { SITE_NAMES } from '../../utils/siteNames'

class BarChartService {
  constructor(db, chart) {
    this.db = db
    this.chart = chart
  }

  legend = () => {
    return this.chart.fieldLabelValueMap.map(({ label, color }) => ({
      name: label,
      symbol: {
        type: 'square',
        fill: color,
      },
    }))
  }

  createChart = async (subjects, userAccess) => {
    const allowedStudies = userAccess.filter(
      (study) => !STUDIES_TO_OMIT.includes(study)
    )
    const initialStudyTotals = this._generateStudyTargetTotals(allowedStudies)
    const dataProcessor = new BarChartDataProcessor(
      this.db,
      this.chart,
      initialStudyTotals
    )
    const processedData = await dataProcessor.processData(subjects)
    const { processedDataBySite, studyTotals, labelMap } = processedData

    const dataBySite =
      subjects.length > 0 ? Array.from(processedDataBySite.values()) : []
    const labels = Array.from(labelMap.values())

    return {
      dataBySite,
      labels,
      studyTotals,
    }
  }

  _generateStudyTargetTotals = (allowedStudies) => {
    const studyTotals = {
      [TOTALS_STUDY]: {
        count: 0,
        targetTotal: 0,
      },
    }
    this.chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      const { targetValues } = fieldLabelValueMap

      allowedStudies.forEach((study) => {
        const siteName = SITE_NAMES[study] || study
        const rawNewTargetValue = targetValues[study]
        const newTargetValue = !!rawNewTargetValue
          ? +rawNewTargetValue
          : undefined

        studyTotals[siteName] = this._studyTargetTotal(
          studyTotals[siteName],
          newTargetValue
        )

        if (targetValues.hasOwnProperty(study)) {
          studyTotals[TOTALS_STUDY].targetTotal = this._totalStudyTargetValue(
            studyTotals[TOTALS_STUDY].targetTotal,
            newTargetValue
          )
        }
      })
    })

    return studyTotals
  }

  _studyTargetTotal = (studyTotals, newTargetValue) => {
    if (studyTotals) {
      if (studyTotals.targetTotal === undefined) {
        return studyTotals
      }

      return {
        ...studyTotals,
        targetTotal: !!newTargetValue
          ? studyTotals.targetTotal + newTargetValue
          : undefined,
      }
    } else {
      return {
        count: 0,
        targetTotal: newTargetValue,
      }
    }
  }

  _totalStudyTargetValue = (totalsStudyTargetTotal, siteTargetValue) => {
    if (totalsStudyTargetTotal === undefined) {
      return totalsStudyTargetTotal
    }

    return !!siteTargetValue
      ? totalsStudyTargetTotal + siteTargetValue
      : undefined
  }
}

export default BarChartService
