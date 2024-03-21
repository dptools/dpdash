import ChartModel from '.'
import { createChart, createUser } from '../../../test/fixtures'

describe('ChartModel', () => {
  describe(ChartModel.isOwnedByUser, () => {
    it('return true when the user owns the chart', () => {
      const user = createUser({ uid: 'user' })
      const chart = createChart({ owner: user.uid })

      expect(ChartModel.isOwnedByUser(chart, user)).toBe(true)
    })

    it('return false when the user does not own the chart', () => {
      const user = createUser({ uid: 'user' })
      const chart = createChart({ owner: 'foo' })

      expect(ChartModel.isOwnedByUser(chart, user)).toBe(false)
    })
  })
})
