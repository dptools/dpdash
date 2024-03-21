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
  describe(UsersModel.userFromFormValues, () => {
    it('returns a user to be updated in the database from a form', () => {
      const updatedUser = createUser({
        access: [
          { value: 'CA', label: 'CA' },
          { value: 'YA', label: 'YA' },
        ],
        role: { value: 'admin' },
      })
      const user = createUser({ access: ['CA', 'YA'], role: 'admin' })

      expect(UsersModel.userFromFormValues(updatedUser)).toEqual(user)
    })
  })
  describe(UsersModel.formValuesFromUser, () => {
    it('returns a user to be used as form values', () => {
      const user = createUser({ access: ['CA', 'YA'], role: 'admin' })
      const formValues = createUser({
        access: [
          { value: 'CA', label: 'CA' },
          { value: 'YA', label: 'YA' },
        ],
        role: { value: 'admin' },
      })

      expect(UsersModel.formValuesFromUser(user)).toEqual(formValues)
    })
  })
})
