import { collections } from '../../utils/mongoCollections'
import { ASC, INCLUSION_EXCLUSION_CRITERIA_FORM, SOCIODEMOGRAPHICS_FORM, TRUE_STRING } from '../../constants'
import { ALL_SUBJECTS_MONGO_PROJECTION, STUDIES_TO_OMIT } from '../../constants'
import { FILTER_TO_MONGO_VALUE_MAP } from '../../services/FiltersService'

const $Consent = '$Consent'
const participant = 'participant'
const $participant = '$participant'
const $participants = '$participants'
const $synced = '$synced'
const oneDayInSeconds = 86400000
const today = new Date()

const ParticipantsModel = {
  index: async (db, user, queryParams) =>
    await db
      .collection(collections.metadata)
      .aggregate(allParticipantsQuery(user, queryParams))
      .toArray(),
  allForAssessment: async (db, chart, filtersService) => {
    const { filters, filterQueries } = filtersService
    const query = {
      assessment: chart.assessment,
      study: { $in: filters.sites, $nin: STUDIES_TO_OMIT },
    }

    if (filtersService.allFiltersInactive()) {
      return await db
        .collection(collections.assessmentDayData)
        .find(query,  { projection: ALL_SUBJECTS_MONGO_PROJECTION })
        .stream()
    }

    const includedParticipantsByFilter = await Promise.all(filterQueries.map((query) => {
      return db.collection(collections.assessmentDayData).distinct('participant', query)
    }))

    const includedParticipants = new Set(includedParticipantsByFilter.flat())

    return await db
      .collection(collections.assessmentDayData)
      .find({ ...query, participant: { $in: Array.from(includedParticipants)} })
      .stream()
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
              $floor: {
                $divide: [{ $subtract: [$synced, $Consent] }, oneDayInSeconds],
              },
            },
            else: {
              $floor: {
                $divide: [{ $subtract: [today, $Consent] }, oneDayInSeconds],
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
