import { collections } from '../../utils/mongoCollections'
import { ASC } from '../../constants'

const $Consent = '$Consent'
const $consentDate = '$consentDate'
const mongoDateNow = '$$NOW'
const participant = 'participant'
const $subject = '$subject'
const $subjects = '$subjects'
const $synced = '$synced'
const $syncedDate = '$syncedDate'
const $today = '$today'

const ParticipantsModel = {
  index: async (db, user, queryParams) =>
    await db
      .collection(collections.metadata)
      .aggregate(allParticipantsQuery(user, queryParams))
      .toArray(),
}

const allParticipantsQuery = (user, queryParams) => {
  const { star, complete } = user.preferences
  const starred = star ? Object.values(star).flat() : []
  const completed = complete ? Object.values(complete).flat() : []
  const { status, sortBy, sortDirection, searchSubjects, studies } = queryParams
  const direction = sortDirection === ASC ? 1 : -1
  const sort = { $sort: { star: -1, [sortBy]: direction } }
  const studiesSet = new Set(studies?.length ? studies : user.access)

  searchSubjects?.forEach((participant) =>
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

    { $unwind: $subjects },
    { $replaceRoot: { newRoot: $subjects } },
    {
      $project: {
        Active: 1,
        Consent: 1,
        complete: {
          $in: [$subject, completed],
        },
        days: 1,
        star: {
          $in: [$subject, starred],
        },
        study: 1,
        subject: 1,
        synced: 1,
        syncedDate: { $dateFromString: { dateString: $synced } },
        consentDate: { $dateFromString: { dateString: $Consent } },
        today: mongoDateNow,
      },
    },
    {
      $addFields: {
        daysInStudy: {
          $cond: {
            if: { $ne: [$syncedDate, null] },
            then: {
              $dateDiff: {
                startDate: $consentDate,
                endDate: $syncedDate,
                unit: 'day',
              },
            },
            else: {
              $dateDiff: {
                startDate: $consentDate,
                endDate: $today,
                unit: 'day',
              },
            },
          },
        },
      },
    },
    { $unset: ['consentDate', 'syncedDate', 'today'] },
  ]

  if (searchSubjects?.length) {
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
              subject: {
                $in: searchSubjects,
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
              subject: {
                $in: searchSubjects,
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
        subjects: {
          $filter: {
            input: $subjects,
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
