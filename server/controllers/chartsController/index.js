import { ObjectId } from 'mongodb'
import deepEqual from 'deep-equal'
import { collections } from '../../utils/mongoCollections'
import { SITE_NAMES } from '../../utils/siteNames'
import {
  generateStudyTargetTotals,
  isAnyTargetIncluded,
  postProcessData,
  processData,
  processTotals,
  mongoQueriesFromFilters,
  calculateSubjectVariableDayCount,
  intersectSubjectsFromFilters,
} from './helpers'
import {
  N_A,
  TOTALS_STUDY,
  STUDIES_TO_OMIT,
  ALL_FILTERS_ACTIVE,
  EMPTY_VALUE,
  ALL_SUBJECTS_MONGO_PROJECTION,
  DEFAULT_CHART_FILTERS,
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
} from '../../constants'

export const graphDataController = async (
  dataDb,
  userAccess,
  chart_id,
  parsedQueryParams
) => {
  const labelMap = new Map()
  const dataMap = new Map()
  const filters = parsedQueryParams.filters || DEFAULT_CHART_FILTERS
  const chart = await dataDb
    .collection(collections.charts)
    .findOne({ _id: ObjectId(chart_id) })
  const allSubjects = await getAllSubjects({
    dataDb,
    chart,
    userAccess,
    filters,
  })
  const allowedStudies = userAccess.filter(
    (study) => !STUDIES_TO_OMIT.includes(study)
  )
  const studyTotals = generateStudyTargetTotals(chart, allowedStudies)

  for await (const subject of allSubjects) {
    const { study } = subject
    const subjectDayData = await dataDb
      .collection(subject.collection)
      .find({})
      .toArray()

    chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      const { color, label, value, targetValues } = fieldLabelValueMap
      const targetValue = targetValues[study]
      const siteName = SITE_NAMES[study] || study
      const dataKey = `${siteName}-${label}-${targetValue}`
      const totalsDataKey = `${TOTALS_STUDY}-${label}`
      const isVariableValueEmpty = value === EMPTY_VALUE
      const shouldCountSubject = isVariableValueEmpty
        ? subjectDayData.every((day) => day[chart.variable] === value)
        : subjectDayData.some((dayData) => dayData[chart.variable] == value)
      const subjectVariableDayCount =
        isVariableValueEmpty && shouldCountSubject
          ? 1
          : calculateSubjectVariableDayCount(
              subjectDayData,
              chart.variable,
              value
            )

      labelMap.set(label, { name: label, color })
      processData({
        shouldCountSubject,
        dataMap,
        dataKey,
        totalsDataKey,
        variableCount: subjectVariableDayCount,
      })
      processTotals({
        shouldCountSubject,
        studyTotals,
        siteName,
        targetValue,
        variableCount: subjectVariableDayCount,
      })
    })
  }

  const dataBySite = postProcessData(dataMap, studyTotals)

  if (isAnyTargetIncluded(studyTotals)) {
    labelMap.set(N_A, { name: N_A, color: '#808080' })
  }

  return {
    chart,
    dataBySite: allSubjects.length > 0 ? Array.from(dataBySite.values()) : [],
    labels: Array.from(labelMap.values()),
    studyTotals,
    filters,
  }
}

const getAllSubjects = async ({ dataDb, chart, userAccess, filters }) => {
  const { assessment } = chart
  const allFiltersSelected = deepEqual(filters, ALL_FILTERS_ACTIVE)
  const subjectCollections = new Set()
  let allSubjects

  if (allFiltersSelected) {
    allSubjects = await dataDb
      .collection(collections.toc)
      .find(
        {
          assessment,
          study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
        },
        { projection: ALL_SUBJECTS_MONGO_PROJECTION }
      )
      .toArray()
  } else {
    const {
      mongoAggregateQueryForIncludedCriteria,
      mongoAggregateQueryForFilters,
      mongoQueryForSocioDemographics,
      activeFilters,
    } = mongoQueriesFromFilters(filters, userAccess)
    const filteredSubjects = []
    const criteriaCursor = await dataDb
      .collection(collections.toc)
      .aggregate(mongoAggregateQueryForFilters)
    const intersectedSubjectsFromFilters = intersectSubjectsFromFilters(
      await criteriaCursor.next()
    )
    await Promise.all(
      Array.from(intersectedSubjectsFromFilters).map(
        async ([subject, collections]) => {
          const data = {}
          for (const { collection, filter } of collections) {
            if (filter === INCLUSION_EXCLUSION_CRITERIA_FORM) {
              const subjectInclusionCriteriaData = await dataDb
                .collection(collection)
                .aggregate(mongoAggregateQueryForIncludedCriteria)
              const inclusionCriteriaData =
                await subjectInclusionCriteriaData.next()

              Object.keys(inclusionCriteriaData).forEach(
                (inclusionCriteriaKey) => {
                  data[inclusionCriteriaKey] =
                    inclusionCriteriaData[inclusionCriteriaKey]
                }
              )
            }

            if (filter === SOCIODEMOGRAPHICS_FORM) {
              data.sex_at_birth = await dataDb
                .collection(collection)
                .find(mongoQueryForSocioDemographics)
                .toArray()
            }
          }

          const isSubjectInFilteredQuery = activeFilters
            .map((requestedFilter) => data[requestedFilter].length > 0)
            .every(Boolean)

          if (isSubjectInFilteredQuery) filteredSubjects.push(subject)
        }
      )
    )

    allSubjects = await dataDb
      .collection(collections.toc)
      .find(
        {
          assessment,
          subject: { $in: filteredSubjects },
        },
        { projection: ALL_SUBJECTS_MONGO_PROJECTION }
      )
      .toArray()
  }

  return allSubjects.filter((subject) => {
    if (subjectCollections.has(subject.collection)) return false
    subjectCollections.add(subject.collection)
    return true
  })
}
