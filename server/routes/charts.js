import { Router } from 'express';

import ensureAuthenticated from '../utils/passport/ensure-authenticated';
import { collections } from '../utils/mongoCollections'
import { userFromRequest } from '../utils/userFromRequestUtil';

import chartsListPage from '../templates/Chart.template'
import newChartPage from '../templates/NewChart.template'
import viewChartPage from '../templates/ViewChart.template';

const router = Router();

router.route('/charts')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const user = userFromRequest(req)

      return res.status(200).send(chartsListPage(user))
    } catch (err) {
      console.error(err.message)

      return res.status(500).send({ message: err.message })
    }
  });

router.route('/charts/new')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const user = userFromRequest(req)

      return res.status(200).send(newChartPage(user))
    } catch (error) {
      console.error(error.message)

      return res.status(500).send({ message: err.message })
    }
})

router.route('/charts/:chart_id')
  .get(ensureAuthenticated, async(req,res) => {
    try {
      const { chart_id } = req.params
      const user = userFromRequest(req)
      const graph = { chart_id }

      return res.status(200).send(viewChartPage(user, graph))
    } catch (err) {
      console.error(err.message)

      return res.status(500).send({ message: err.message })
    }
  })

router.route('/api/v1/charts')
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const { fieldLabelValueMap, title, variable, assessment } = req.body
      const { dataDb } = req.app.locals
      const { insertedId } = await dataDb
        .collection(collections.charts)
        .insertOne({
          title, 
          variable, 
          assessment, 
          owner: req.user, 
          fieldLabelValueMap 
        })

      return res.status(200).json({ data: { chart_id: insertedId }})
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    }
  })

export default router
