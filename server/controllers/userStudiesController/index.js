import UserModel from '../../models/UserModel'
import UserStudiesModel from '../../models/UserStudiesModel'

const userStudiesController = {
  index: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const isSortRequested = Object.hasOwn(req.query, 'sort')
      const parsedSortParams =
        isSortRequested && Object.keys(req.query.sort).length
          ? req.query.sort
          : { sortBy: 'study', sortDirection: 'ASC' }
      const userAccess = await UserModel.findOne(
        appDb,
        { uid: req.user.uid },
        { access: 1 }
      )
      const userStudies = await UserStudiesModel.all(
        appDb,
        userAccess.access,
        parsedSortParams
      )

      return res.status(200).json({ data: userStudies })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  },
}

export default userStudiesController
