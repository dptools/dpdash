import UserModel from '../../models/UserModel'

const AdminUsersController = {
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const updatedUser = await UserModel.update(appDb, uid, req.body)

      return res.status(200).json({ data: updatedUser })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default AdminUsersController
