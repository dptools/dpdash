import { ObjectId } from 'mongodb'
import UserModel from '../../models/UserModel'
import ConfigModel from '../../models/ConfigModel'
import DashboardService from '../../services/DashboardService'

const DashboardsController = {
  show: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { study, subject } = req.params
      const user = await UserModel.findOne(appDb, { uid: req.user.uid })
      const userConfigurationQuery = {
        _id: new ObjectId(user.preferences.config),
      }
      const config = await ConfigModel.findOne(appDb, userConfigurationQuery)
      const flatConfig = Object.values(config.config).flat()

      const { createMatrix, consentDate } = new DashboardService(
        appDb,
        study,
        subject,
        flatConfig
      )
      const participantConsentDate = await consentDate()
      const matrixData = await createMatrix()

      return res.status(200).json({
        data: {
          subject: { sid: subject, project: study },
          graph: {
            matrixData,
            configurations: flatConfig,
            consentDate: participantConsentDate,
          },
        },
      })
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  },
}

export default DashboardsController
