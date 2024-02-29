import { chartsListQuery } from '.'
import { createUser } from '../../../test/fixtures'

describe(chartsListQuery, () => {
  it('returns a mongodb charts query', () => {
    const user = createUser({ favoriteCharts: ['1', '2'] })
    const queryParams = { sortBy: 'title', sortDirection: 'ASC' }

    expect(chartsListQuery(user, queryParams)).toEqual([
      {
        $match: {
          $or: [
            {
              owner: 'user-uid',
            },
            {
              sharedWith: 'user-uid',
            },
            {
              public: true,
            },
          ],
        },
      },
      {
        $addFields: {
          chart_id: {
            $toString: '$_id',
          },
        },
      },
      {
        $addFields: {
          favorite: {
            $in: ['$chart_id', ['1', '2']],
          },
        },
      },
      {
        $unset: 'chart_id',
      },
      {
        $sort: {
          favorite: -1,
          title: 1,
        },
      },
    ])
  })
})
