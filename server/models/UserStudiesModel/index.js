import { ASC, STUDIES_TO_OMIT } from '../../constants'
import { collections } from '../../utils/mongoCollections'

const UserStudiesModel = {
  all: async (db, studiesList, sortDirective) =>
    await db
      .collection(collections.metadata)
      .aggregate(userStudiesQuery(studiesList, sortDirective))
      .toArray(),
}

const userStudiesQuery = (studiesList, sortDirective) => {
  const sortDirection = sortDirective.sortDirection === ASC ? 1 : -1
  const sort = { [sortDirective.sortBy]: sortDirection }

  return [
    { $match: { study: { $in: studiesList, $nin: STUDIES_TO_OMIT } } },
    {
      $project: {
        _id: 0,
        study: 1,
        numOfParticipants: {
          $cond: {
            if: { $isArray: '$participants' },
            then: { $size: '$participants' },
            else: 0,
          },
        },
        daysInStudy: { $max: '$participants.daysInStudy' },
        updatedAt: 1,
      },
    },
    { $sort: sort },
  ]
}

export default UserStudiesModel
