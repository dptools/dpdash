import { collections } from '../../utils/mongoCollections'

const MetadataModel = {
  findOne: async (db, metadataAttributes) =>
    await db.collection(collections.metadata).findOne(metadataAttributes),
  subjectCount: async (db, sites) => {
    return await db
      .collection(collections.metadata)
      .aggregate(countParticipantsQuery(sites))
  },
}

const countParticipantsQuery = (sites) => [
  {
    $match: {
      study: { $in: sites },
    },
  },
  {
    $group: {
      _id: 'subjects',
      totalParticipants: { $sum: { $size: { $ifNull: ['$subjects', []] } } },
    },
  },
]
export default MetadataModel
