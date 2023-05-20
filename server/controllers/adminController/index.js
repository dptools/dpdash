import UserModel from '../../models/UserModel'

const AdminUsersController = {
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const updatedUser = await UserModel.update(appDb, uid, req.body)

      return updatedUser.modifiedCount === 1
        ? res.status(200).json({ data: updatedUser })
        : res.status(404).json({ message: 'User could not be updated' })
    } catch (error) {
      return res.status(404).json({ message: 'User could not be updated' })
    }
  },
}

export default AdminUsersController
