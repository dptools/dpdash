import AssessmentModel from '../../models/AssessmentModel'

const assessmentsController = {
  index: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const isSearchRequested = Object.hasOwn(req.query, 'search')
      const assessmentModelQuery = !isSearchRequested
        ? {}
        : {
            name: { $regex: req.query.search, $options: 'i' },
          }
      const assessmentList = await AssessmentModel.all(
        appDb,
        assessmentModelQuery
      )

      return res.status(200).json({ data: assessmentList })
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  },
}

export default assessmentsController
