import { collections } from '../../utils/mongoCollections'
import { ASC } from '../../constants'
import { ALL_SUBJECTS_MONGO_PROJECTION, STUDIES_TO_OMIT } from '../../constants'

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
    const { filterQueries } = filtersService
    const query = {
      assessment: chart.assessment,
      study: { $in: filtersService.requestedSites, $nin: STUDIES_TO_OMIT },
    }
    if (filtersService.allFiltersInactive()) {
      return await db
        .collection(collections.assessmentDayData)
        .find(query, { projection: ALL_SUBJECTS_MONGO_PROJECTION })
        .stream()
    }

    const groupedParticipants = await Promise.all(
      filterQueries.map((query) => {
        return db
          .collection(collections.assessmentDayData)
          .distinct('participant', query)
      })
    )

    return await db
      .collection(collections.assessmentDayData)
      .find({
        ...query,
        participant: {
          $in:
            groupedParticipants.length > 1
              ? ParticipantsModel.intersectParticipants(
                  groupedParticipants[0],
                  groupedParticipants[1]
                )
              : groupedParticipants.flat(),
        },
      })
      .stream()
  },
  intersectParticipants: (listA, listB) => {
    const smallestList = listA.length < listB.length ? listA : listB
    const largestList = listA.length > listB.length ? listA : listB

    return smallestList.reduce((participants, participant) => {
      const isParticipantInLargeList = largestList.includes(participant)

      if (isParticipantInLargeList) participants.push(participant)

      return participants
    }, [])
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
