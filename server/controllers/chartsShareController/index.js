import { ObjectId } from 'mongodb'
import ChartsModel from '../../models/ChartsModel'

const chartsShareController = {
  create: async (req, res) => {
    {
      try {
        const { chart_id } = req.params
        const { dataDb } = req.app.locals
        const { sharedWith } = req.body
        const { value } = await ChartsModel.update(
          dataDb,
          { _id: new ObjectId(chart_id) },
          {
            sharedWith,
            updatedAt: new Date().toISOString(),
          }
        )

        return res.status(200).json({ data: value })
      } catch (error) {
        return res.status(400).json({ error: 'Chart could not be shared' })
      }
    }
  },
}

export default chartsShareController
