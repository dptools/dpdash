import UserModel from '../../models/UserModel'

const ApiUsersController = {
  index: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const users = await UserModel.all(appDb)

      return res.status(200).json({ data: users })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default ApiUsersController
