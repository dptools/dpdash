import UsersModel from '.'
import { createUser } from '../../../test/fixtures'

describe('Models - UsersModel', () => {
  describe(UsersModel.createUserFriendList, () => {
    it('returns a user list with label, value, and isFixed properties', () => {
      const user = createUser()

      const users = [
        user,
        createUser({ uid: 'user2' }),
        createUser({ uid: 'user3' }),
      ]
      const selectUsersList = UsersModel.createUserFriendList(users, user.uid)

      expect(selectUsersList).toEqual([
        {
          isFixed: true,
          label: 'user-uid',
          value: 'user-uid',
        },
        {
          isFixed: false,
          label: 'user2',
          value: 'user2',
        },
        {
          isFixed: false,
          label: 'user3',
          value: 'user3',
        },
      ])
    })
  })
})
