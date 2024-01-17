import passport from 'passport'
import AuthController from '.'
import {
  createRequest,
  createRequestWithUser,
  createResponse,
  createUser,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'
import UserModel from '../../models/UserModel'

afterEach(() => {
  jest.clearAllMocks()
})
describe('AuthController', () => {
  describe(AuthController.destroy, () => {
    describe('When successful', () => {
      it('returns a status of 200 and success data message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        await AuthController.destroy(request, response, jest.fn())

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: { message: 'User is logged out' },
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 500 and an error message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const next = jest.fn()

        request.logout.mockImplementationOnce(() => {
          throw new Error('some error')
        })

        await AuthController.destroy(request, response, next)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })
  describe(AuthController.show, () => {
    describe('When successful', () => {
      it('returns a status of 200 and a user object', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = createUser()

        request.app.locals.appDb.findOne.mockResolvedValueOnce(user)

        await AuthController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: user,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('some error')
        )

        await AuthController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })

  describe(AuthController.update, () => {
    describe('When successful', () => {
      it('Resets the user password and returns a user object', async () => {
        const request = createRequestWithUser({
          body: {
            username: 'username',
            password: 'newpass',
            confirmPassword: 'newpass',
            reset_key: 'reset_key',
          },
        })
        const response = createResponse()
        const user = createUser({
          password: 'oldpass',
          reset_key: 'reset_key',
        })
        const updatedUser = {
          ...user,
          reset_key: '',
        }

        request.app.locals.appDb.findOne.mockResolvedValueOnce(user)
        request.app.locals.appDb.findOneAndUpdate.mockResolvedValueOnce({
          value: updatedUser,
        })

        await AuthController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: {
            ...user,
            reset_key: '',
          },
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error', async () => {
        const request = createRequestWithUser({
          body: {
            username: 'username',
            password: 'newpass',
            confirmPassword: 'newpass',
            reset_key: 'reset_key',
          },
        })
        const response = createResponse()
        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('some error')
        )

        await AuthController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ error: 'some error' })
      })
    })

    describe('When sent non-string values', () => {
      it('stringifies the value before querying the database', async () => {
        const request = createRequestWithUser({
          body: {
            username: {
              $nin: [],
            },
            password: 'newpass',
            confirmPassword: 'newpass',
            reset_key: {
              $nin: [],
            },
          },
        })
        const response = createResponse()
        const user = createUser({
          password: 'oldpass',
          reset_key: 'reset_key',
        })

        const mockFindOne = jest.fn().mockResolvedValueOnce(null)
        request.app.locals.appDb.collection = jest
          .fn()
          .mockImplementation(() => ({
            findOne: mockFindOne,
          }))

        await AuthController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(mockFindOne).toHaveBeenCalledWith(
          {
            uid: '[object Object]',
            reset_key: '[object Object]',
            force_reset_pw: true,
          },
          {
            projection: {
              _id: 0,
              password: 0,
              bad_pwd_count: 0,
              lockout_time: 0,
              last_logoff: 0,
              last_logon: 0,
              force_reset_pw: 0,
            },
          }
        )
      })
    })
  })
  describe(AuthController.create, () => {
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const response = createResponse()
        const user = createUser({
          password: 'somepassword',
          confirmPassword: 'somepassword',
        })
        const request = createRequest({ 
          body: user,
          app: {
            locals: { appDb: global.MONGO_INSTANCE.db('dpdmongo'), dataDb: global.MONGO_INSTANCE.db('dpdata') }
          }
        })

        UserModel.create = jest.fn().mockRejectedValueOnce(new Error('some error'))

        await AuthController.create(request, response, jest.fn())

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
    describe('When user has an account', () => {
      it('returns a status of 400 and an error message when user has an account', async () => {
        const request = createRequestWithUser({
          body: {
            username: 'username',
            password: 'newpass',
            confirmPassword: 'newpass',
          },
          app: { locals: { appDb: global.MONGO_INSTANCE.db('dpdmongo'), dataDb: global.MONGO_INSTANCE.db('dpdata') } }
        })
        const response = createResponse()

        const user = createUser({ uid: 'username' })
        await request.app.locals.appDb.collection(collections.users).insertOne(user)

        await AuthController.create(request, response, jest.fn())

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'User has an account',
        })
      })
    })
  })
})
