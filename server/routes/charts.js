import { Router } from 'express';

import ensureAuthenticated from '../utils/passport/ensure-authenticated';

import chartsListPage from '../templates/Chart.template'
import newChartPage from '../templates/NewChart.template'

const router = Router();

router.route('/charts')
  .get(ensureAuthenticated, async (_, res) => {
    try {
      return res.status(200).send(chartsListPage())
    } catch (err) {
      console.error(err.message)

      return res.status(500).send({ message: err.message })
    }
  });
  
router.route('/charts/new')
  .get(ensureAuthenticated, async (_, res) => {
    try {
      return res.status(200).send(newChartPage())
    } catch (error) {
      console.error(err.message)

      return res.status(500).send({ message: err.message })
    }
})

export default router
