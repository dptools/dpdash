import {
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
  ALL_SUBJECTS_MONGO_PROJECTION,
  STUDIES_TO_OMIT,
} from '../../constants'
import { collections } from '../../utils/mongoCollections'

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
  allForAssessment: async (db, assessment, filtersService) => {
    const allFiltersDeselected = filtersService.allFiltersInactive()
    let allSubjects

    if (allFiltersDeselected) {
      allSubjects = await db
        .collection(collections.toc)
        .find(
          {
            assessment,
            study: { $in: filtersService.filters.sites, $nin: STUDIES_TO_OMIT },
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
      } = filtersService.barChartMongoQueries()
      const filteredSubjects = []
      const criteriaCursor = await db
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
                const subjectInclusionCriteriaData = await db
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
                data.sex_at_birth = await db
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

      allSubjects = await db
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

    const subjectCollections = new Set()
    return allSubjects.filter((subject) => {
      if (subjectCollections.has(subject.collection)) return false
      subjectCollections.add(subject.collection)
      return true
    })
  },
}

export default SubjectModel
