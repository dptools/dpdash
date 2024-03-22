import { ObjectId } from 'mongodb'
import ChartsModel from '../../models/ChartsModel'

const chartsShareController = {
  create: async (req, res) => {
    {
      try {
        const { chart_id } = req.params
        const { appDb } = req.app.locals
        const { sharedWith } = req.body
        const data = await ChartsModel.update(
          appDb,
          { _id: new ObjectId(chart_id) },
          {
            sharedWith,
          }
        )

        return res.status(200).json({ data: data })
      } catch (error) {
        return res.status(400).json({ error: 'Chart could not be shared' })
      }
    }
  },
}

export default chartsShareController
