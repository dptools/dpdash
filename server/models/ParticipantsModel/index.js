import { collections } from '../../utils/mongoCollections'

const subjects = '$subjects'
const ParticipantsModel = {
  index: async (db, sites) =>
    await db
      .collection(collections.metadata)
      .aggregate(allParticipantsQuery(sites))
      .toArray(),
}

const allParticipantsQuery = (sites) => [
  { $match: { study: { $in: sites } } },
  {
    $addFields: {
      numOfSubjects: { $size: { $ifNull: [subjects, []] } },
    },
  },
  { $sort: { study: 1 } },
  { $unwind: subjects },
  { $replaceRoot: { newRoot: subjects } },
]

export default ParticipantsModel
