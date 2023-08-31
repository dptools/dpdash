import {
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
  ALL_SUBJECTS_MONGO_PROJECTION,
  STUDIES_TO_OMIT,
} from '../../constants'
import FiltersService from '../../services/FiltersService'

export const intersectSubjectsFromFilters = (filters) => {
  const intersectedSubjects = new Map()
  const [filteredSubjectsListA, ...rest] = Object.values(filters).map(
    (filter) => {
      const filterMap = new Map()
      filter.forEach((subjectData) => {
        filterMap.set(subjectData.subject, { ...subjectData })
      })

      return filterMap
    }
  )
  filteredSubjectsListA.forEach((subjectData) => {
    const { subject, collection, filter } = subjectData
    intersectedSubjects.set(subject, [{ collection, filter }])

    rest.forEach((filterList) => {
      const existingSubjectData = intersectedSubjects.get(subject)
      const filteredSubjectData = filterList.get(subject)

      if (!!existingSubjectData && !!filteredSubjectData) {
        intersectedSubjects.set(
          subjectData.subject,
          existingSubjectData.concat([
            {
              collection: filteredSubjectData.collection,
              filter: filteredSubjectData.filter,
            },
          ])
        )
      } else {
        intersectedSubjects.delete(subject)
      }
    })
  })

  return intersectedSubjects
}

const SubjectModel = {
  allForAssessment: async (appDb, assessment, userAccess, filters) => {
    const filtersService = new FiltersService(filters, userAccess)
    const allFiltersSelected = filtersService.allFiltersActive()
    let allSubjects

    if (allFiltersSelected) {
      allSubjects = await appDb
        .collection('assessmentSubjectDayData')
        .aggregate([
          { 
            $match: {
              assessment,
              study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
            } 
          },
          { $group: { _id: '$subject', data: { $first: "$$ROOT" } } },
          {
            "$replaceRoot": { "newRoot": "$data" }
          },
          { $project: ALL_SUBJECTS_MONGO_PROJECTION }
        ])
        .toArray()
    } else {
      const {
        mongoAggregateQueryForIncludedCriteria,
        mongoAggregateQueryForFilters,
        mongoQueryForSocioDemographics,
        activeFilters,
      } = filtersService.barChartMongoQueries()
      const filteredSubjects = []

      const criteriaCursor = await appDb
        .collection('assessmentSubjectDayData')
        .aggregate(mongoAggregateQueryForFilters)
      const criteria = await criteriaCursor.next()

      const intersectedSubjectsFromFilters = intersectSubjectsFromFilters(criteria)

      await Promise.all(
        Array.from(intersectedSubjectsFromFilters).map(
          async ([subject, collections]) => {
            const data = {}
            for (const { collection, filter } of collections) {
              if (filter === INCLUSION_EXCLUSION_CRITERIA_FORM) {
                const subjectInclusionCriteriaData = await appDb
                  .collection('assessmentSubjectDayData')
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
                data.sex_at_birth = await appDb
                  .collection('assessmentSubjectDayData')
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

      allSubjects = await appDb
        .collection('assessmentSubjectDayData')
        .aggregate([
          { 
            $match: {
              assessment,
              study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
              subject: { $in: filteredSubjects },
            } 
          },
          { $group: { _id: '$subject', data: { $first: "$$ROOT" } } },
          {
            "$replaceRoot": { "newRoot": "$data" }
          },
          { $project: ALL_SUBJECTS_MONGO_PROJECTION }
        ])
        .toArray()
    }

    const subjectCollections = new Set()
    return allSubjects.filter((subject) => {
      if (subjectCollections.has(subject.collection)) return false
      subjectCollections.add(subject.collection)
      return true
    })
  },
}

export default SubjectModel
