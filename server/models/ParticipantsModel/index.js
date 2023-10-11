import { collections } from '../../utils/mongoCollections'
import { ASC } from '../../constants'

const subjects = '$subjects'
const subject = '$subject'

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
  const { sortBy, sortDirection, searchSubjects } = queryParams
  const direction = sortDirection === ASC ? 1 : -1
  const sort = { $sort: { star: -1, [sortBy]: direction } }
  const query = [
    { $match: { study: { $in: user.access } } },
    { $unwind: subjects },
    { $replaceRoot: { newRoot: subjects } },
    {
      $project: {
        subject: '$Subject ID',
        days: 1,
        study: '$Study',
        star: {
          $in: [subject, starred],
        },
        complete: {
          $in: [subject, completed],
        },
      },
    },
  ]

  if (searchSubjects?.length)
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

  query.push(sort)

  return query
}

export default ParticipantsModel
