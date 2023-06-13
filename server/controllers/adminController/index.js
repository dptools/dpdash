import UserModel from '../../models/UserModel'

const AdminUsersController = {
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const { value } = await UserModel.update(appDb, uid, req.body)

      return value ? res.status(200).json({ data: value }) : res.status(404)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },
}

export default AdminUsersController
