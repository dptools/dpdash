import { ObjectId } from 'mongodb'
import ChartsModel from '../../models/ChartsModel'

const chartsDuplicateController = {
  create: async (req, res) => {
    {
      try {
        const { dataDb } = req.app.locals
        const { chart_id } = req.body
        const { _id, ...rest } = await ChartsModel.show(dataDb, {
          _id: new ObjectId(chart_id),
        })
        const { insertedId } = await ChartsModel.create(dataDb, {
          ...rest,
          title: `${rest.title} (copy)`,
          owner: req.user.uid,
          public: false,
          sharedWith: [],
        })

        return res.status(200).json({ data: insertedId })
      } catch (error) {
        return res.status(400).json({ error: error.message })
      }
    }
  },
}

export default chartsDuplicateController
