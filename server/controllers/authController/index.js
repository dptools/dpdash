import UserModel from '../../models/UserModel'

const AuthController = {
  destroy: async (req, res) => {
    try {
      await req.session.destroy()
      await req.logout()

      res.clearCookie('connect.sid')

      return res.status(200).json({ data: { message: 'User is logged out' } })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },
  show: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const user = await UserModel.findOne(appDb, req.user)

      return res.status(200).json({ data: user })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default AuthController
