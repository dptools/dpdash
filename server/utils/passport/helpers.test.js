import * as helpers from './helpers'

describe('helpers', () => {
  describe(helpers.isAccountExpired, () => {
    it('returns false if user role is admin', () => {
      expect(helpers.isAccountExpired(null, 'admin')).toEqual(false)
    })

    it('returns false when user is not an admin and account is current', () => {
      expect(helpers.isAccountExpired('2122-08-21', 'member')).toEqual(false)
    })

    it('returns true if user role is not admin and account is expired', () => {
      expect(helpers.isAccountExpired('2022-08-21', 'member')).toEqual(true)
    })

    it('returns true if user account is expired is not set', () => {
      expect(helpers.isAccountExpired(null, 'member')).toEqual(true)
    })
  })
})
