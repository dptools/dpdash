import UserModel from '../../models/UserModel'

const UsersController = {
  edit: async (req, res) => {
    try {
      const { appDb, dataDb } = req.app.locals
      const { uid } = req.params
      const {
        company,
        department,
        display_name,
        icon,
        iconFileName,
        mail,
        title,
        preferences,
      } = req.body
      const updatedUser = await UserModel.update(appDb, dataDb, uid, {
        company: String(company),
        department: String(department),
        display_name: String(display_name),
        mail: String(mail),
        title: String(title),
        icon: String(icon),
        iconFileName: String(iconFileName),
        preferences,
      })

      return res.status(200).json({ data: updatedUser })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  show: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const user = await UserModel.findOne(appDb, { uid })

      return res.status(200).json({ data: user })
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      })
    }
  },
}

export default UsersController
