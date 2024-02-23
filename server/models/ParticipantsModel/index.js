import { collections } from '../../utils/mongoCollections'
import { ASC } from '../../constants'
import AssessmentDayDataModel from '../AssessmentDayDataModel'
import { ALL_SUBJECTS_MONGO_PROJECTION, STUDIES_TO_OMIT } from '../../constants'

const $Consent = '$Consent'
const participant = 'participant'
const $participant = '$participant'
const $participants = '$participants'
const $synced = '$synced'
const timeUnit = 'day'

const ParticipantsModel = {
  index: async (db, user, queryParams) =>
    await db
      .collection(collections.metadata)
      .aggregate(allParticipantsQuery(user, queryParams))
      .toArray(),
  allForAssessment: async (db, chart, filtersService) => {
    const allFiltersDeselected = filtersService.allFiltersInactive()

    if (allFiltersDeselected) {
      const query = {
        assessment: chart.assessment,
        study: { $in: filtersService.filters.sites, $nin: STUDIES_TO_OMIT },
      }
      return await db
        .collection(collections.assessmentDayData)
        .find(query, { projection: ALL_SUBJECTS_MONGO_PROJECTION })
        .stream()
    } else {
      const mongoFacet = filtersService.barChartMongoQueries()
      const isAggregateQuery = Array.isArray(mongoFacet)
      const query = isAggregateQuery
        ? mongoFacet
        : Object.keys(mongoFacet).reduce((_, next) => {
            return mongoFacet[next][0].$match
          }, {})

      const participants = isAggregateQuery
        ? await AssessmentDayDataModel.index(db, query)
        : await AssessmentDayDataModel.all(db, query)

      const chartQuery = {
        assessment: chart.assessment,
        participant: {
          $in: isAggregateQuery
            ? participants[0].participants
            : participants.map(({ participant }) => participant),
        },
      }

      return await db
        .collection(collections.assessmentDayData)
        .find(chartQuery, { projection: ALL_SUBJECTS_MONGO_PROJECTION })
        .stream()
    }
  },
}

const allParticipantsQuery = (user, queryParams) => {
  const { star, complete } = user.preferences
  const starred = star ? Object.values(star).flat() : []
  const completed = complete ? Object.values(complete).flat() : []
  const { status, sortBy, sortDirection, searchParticipants, studies } =
    queryParams
  const direction = sortDirection === ASC ? 1 : -1
  const sort = { $sort: { star: -1, [sortBy]: direction } }
  const studiesSet = new Set(studies?.length ? studies : user.access)

  searchParticipants?.forEach((participant) =>
    studiesSet.add(`${participant[0]}${participant[1]}`)
  )
  const studiesQuery = Array.from(studiesSet)

  const query = [
    {
      $match: {
        $or: [
          {
            study: {
              $in: studiesQuery,
            },
          },
        ],
      },
    },

    { $unwind: $participants },
    { $replaceRoot: { newRoot: $participants } },
    {
      $project: {
        Active: 1,
        Consent: 1,
        complete: {
          $in: [$participant, completed],
        },
        days: 1,
        star: {
          $in: [$participant, starred],
        },
        study: 1,
        participant: 1,
        synced: 1,
        daysInStudy: {
          $cond: {
            if: { $ne: [$synced, null] },
            then: {
              $dateDiff: {
                startDate: { $toDate: $Consent },
                endDate: { $toDate: $synced },
                unit: timeUnit,
              },
            },
            else: {
              $dateDiff: {
                startDate: { $toDate: $Consent },
                endDate: new Date(),
                unit: timeUnit,
              },
            },
          },
        },
      },
    },
  ]

  if (searchParticipants?.length) {
    if (studies?.length) {
      query.push({
        $match: {
          $or: [
            {
              study: {
                $in: studies,
              },
            },
            {
              participant: {
                $in: searchParticipants,
              },
            },
          ],
        },
      })
    } else {
      query.push({
        $match: {
          $or: [
            {
              participant: {
                $in: searchParticipants,
              },
            },
          ],
        },
      })
    }
  }

  if (status) {
    query.splice(1, 0, {
      $project: {
        participants: {
          $filter: {
            input: $participants,
            as: participant,
            cond: { $eq: ['$$participant.Active', +status] },
          },
        },
      },
    })
  }
  query.push(sort)

  return query
}

export default ParticipantsModel
