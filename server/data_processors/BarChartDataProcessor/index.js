import { EMPTY_VALUE, N_A, TOTALS_STUDY } from '../../constants'
import { SITE_NAMES } from '../../utils/siteNames'

const studyCountsToPercentage = (studyCount, targetTotal) => {
  if (!targetTotal || Number.isNaN(+studyCount) || Number.isNaN(+targetTotal)) {
    return 0
  }

  return (+studyCount / +targetTotal) * 100
}

const calculateTotalsTargetValue = (currentTargetCount, nextTargetCount) =>
  !!currentTargetCount
    ? +currentTargetCount + +nextTargetCount
    : +nextTargetCount

const calculateStudySectionTargetValue = (
  studySectionTotalTarget,
  studySectionTotalCount
) => {
  if (
    !!studySectionTotalTarget &&
    studySectionTotalTarget > studySectionTotalCount
  ) {
    return +studySectionTotalTarget
  }

  return +studySectionTotalCount || 0
}

class BarChartDataProcessor {
  constructor(chart, studyTotals) {
    this.chart = chart
    this.studyTotals = studyTotals
    this.labelMap = new Map()
    this.dataMap = new Map()
  }

  processDocument = (document) => {
    this.chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      this._processFieldLabelValueMap(
        fieldLabelValueMap,
        document.study,
        document.dayData
      )
    })
  }

  processData = () => {
    this._postProcessData()

    if (this._isAnyTargetIncluded()) {
      this.labelMap.set(N_A, { name: N_A, color: '#808080' })
    }

    return this
  }

  _processFieldLabelValueMap = (
    fieldLabelValueMap,
    study,
    participantDayData
  ) => {
    const { color, label, value, targetValues } = fieldLabelValueMap
    const targetValue = targetValues[study]
    const siteName = SITE_NAMES[study] || study
    const dataKey = `${siteName}-${label}-${targetValue}`
    const totalsDataKey = `${TOTALS_STUDY}-${label}`
    const isVariableValueEmpty = value === EMPTY_VALUE
    const shouldCountParticipant = isVariableValueEmpty
      ? participantDayData.every((day) => day[this.chart.variable] === value)
      : participantDayData.some(
          (dayData) => dayData[this.chart.variable] == value
        )
    const participantVariableDayCount =
      isVariableValueEmpty && shouldCountParticipant
        ? 1
        : this.#calculateParticipantVariableDayCount(participantDayData, value)

    this.labelMap.set(label, { name: label, color })
    this._processData({
      shouldCountParticipant,
      dataKey,
      totalsDataKey,
      variableCount: participantVariableDayCount,
    })
    this._processTotals({
      shouldCountParticipant,
      siteName,
      targetValue,
      variableCount: participantVariableDayCount,
    })
  }

  #calculateParticipantVariableDayCount = (
    participantAssessmentDayData,
    chartValue
  ) => {
    const isChartVariableNaN = isNaN(chartValue)
    const variableValue = isChartVariableNaN ? chartValue : +chartValue
    const participantsDayDataAndVariable = participantAssessmentDayData.filter(
      (dayData) => dayData[this.chart.variable] === variableValue
    )

    return participantsDayDataAndVariable.length
  }

  _processData = ({
    shouldCountParticipant,
    dataKey,
    totalsDataKey,
    variableCount,
  }) => {
    if (shouldCountParticipant) {
      const existingData = this.dataMap.get(dataKey)
      const existingTotalsData = this.dataMap.get(totalsDataKey)

      if (existingData) {
        this.dataMap.set(dataKey, existingData + variableCount)
      } else {
        this.dataMap.set(dataKey, variableCount)
      }

      if (existingTotalsData) {
        this.dataMap.set(totalsDataKey, existingTotalsData + variableCount)
      } else {
        this.dataMap.set(totalsDataKey, variableCount)
      }
    } else {
      if (!this.dataMap.get(dataKey)) this.dataMap.set(dataKey, 0)
    }
  }

  _processTotals = ({
    shouldCountParticipant,
    siteName,
    targetValue,
    variableCount,
  }) => {
    if (shouldCountParticipant) {
      if (this.studyTotals[siteName]) {
        this.studyTotals[siteName].count += variableCount
      } else {
        this.studyTotals[siteName] = {
          count: variableCount,
          targetValue,
        }
      }
      this.studyTotals[TOTALS_STUDY].count += variableCount
    }
  }

  _postProcessData = () => {
    const processedDataBySite = new Map()
    const totalsValueTargets = {}

    for (const [key, count] of this.dataMap) {
      const [study, valueLabel, targetValue] = key.split('-')
      const totalsForStudy = this.studyTotals[study]
      const totals = totalsForStudy.targetTotal || totalsForStudy.count
      const percent = studyCountsToPercentage(count, totals)
      const existingEntriesForStudy = processedDataBySite.get(study)
      const targetValueAsNumber = +targetValue
      const targetValueIsNaN = Number.isNaN(targetValueAsNumber)
      const hasTargetValue =
        !!targetValue && !targetValueIsNaN && study !== TOTALS_STUDY
      const isTargetValueMissing = !targetValue && study !== TOTALS_STUDY

      if (hasTargetValue) {
        totalsValueTargets[valueLabel] = calculateTotalsTargetValue(
          totalsValueTargets[valueLabel],
          targetValue
        )
      }

      if (isTargetValueMissing) {
        totalsValueTargets[valueLabel] = calculateTotalsTargetValue(
          totalsValueTargets[valueLabel],
          totalsForStudy.count
        )
      }

      if (existingEntriesForStudy) {
        processedDataBySite.set(study, {
          ...existingEntriesForStudy,
          counts: {
            ...existingEntriesForStudy.counts,
            [valueLabel]: count,
          },
          percentages: {
            ...existingEntriesForStudy.percentages,
            [valueLabel]: percent,
          },
          targets: {
            ...existingEntriesForStudy.targets,
            [valueLabel]: targetValueIsNaN ? undefined : +targetValueAsNumber,
          },
        })
      } else {
        processedDataBySite.set(study, {
          name: study,
          counts: {
            [valueLabel]: count,
          },
          totalsForStudy,
          percentages: {
            [valueLabel]: percent,
          },
          targets: {
            [valueLabel]: targetValueIsNaN ? undefined : +targetValueAsNumber,
          },
        })
      }
    }

    for (const [study, values] of processedDataBySite) {
      const { targetTotal, count: currentSiteCount } = this.studyTotals[study]
      const isTargetGreaterThanCount =
        targetTotal && targetTotal > currentSiteCount
      const count = isTargetGreaterThanCount
        ? targetTotal - currentSiteCount
        : 0
      const studySectionTargetValue = calculateStudySectionTargetValue(
        targetTotal,
        currentSiteCount
      )
      const percent = studyCountsToPercentage(count, studySectionTargetValue)

      processedDataBySite.set(study, {
        ...values,
        counts: {
          ...values.counts,
          [N_A]: count,
        },
        percentages: {
          ...values.percentages,
          [N_A]: percent,
        },
      })
    }

    const processedTotals = processedDataBySite.get(TOTALS_STUDY)
    processedDataBySite.set(TOTALS_STUDY, {
      ...processedTotals,
      targets: totalsValueTargets,
    })

    this.processedDataBySite = processedDataBySite
  }

  _isAnyTargetIncluded = () => {
    return Object.keys(this.studyTotals)
      .filter((site) => site !== TOTALS_STUDY)
      .some((site) => this.studyTotals[site]?.targetTotal !== undefined)
  }
}

export default BarChartDataProcessor
