import { STUDIES_TO_OMIT, TOTALS_STUDY } from '../../constants'
import { SITE_NAMES } from '../../utils/siteNames'
import BarChartDataProcessor from '../../data_processors/BarChartDataProcessor'
import ParticipantsModel from '../../models/ParticipantsModel'

class BarChartService {
  constructor(appDb, chart, filtersService) {
    this.chart = chart
    this.appDb = appDb
    this.filtersService = filtersService
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

  generateStudyTargetTotals = (userAccess) => {
    const allowedStudies = userAccess.filter(
      (study) => !STUDIES_TO_OMIT.includes(study)
    )

    const studyTotals = {
      [TOTALS_STUDY]: {
        count: 0,
        targetTotal: 0,
      },
    }
    this.chart.fieldLabelValueMap.forEach((fieldValue) => {
      const { targetValues } = fieldValue

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

  createChart = async () => {
    const { filters } = this.filtersService
    const chartProcessor = new BarChartDataProcessor(
      this.chart,
      this.generateStudyTargetTotals(filters.sites)
    )
    const dataStream = await ParticipantsModel.allForAssessment(
      this.appDb,
      this.chart,
      this.filtersService
    )
    dataStream.on('data', (doc) => chartProcessor.processDocument(doc))
    await new Promise((resolve, reject) => {
      dataStream.on('end', () => resolve())

      dataStream.on('error', (err) => reject(err))
    })

    const { processedDataBySite, studyTotals, labelMap } =
      chartProcessor.processData()

    return { processedDataBySite, studyTotals, labelMap }
  }
}

export default BarChartService
