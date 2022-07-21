import { Router } from 'express';
import { ObjectID } from 'mongodb';

import ensureAuthenticated from '../utils/passport/ensure-authenticated';
import { collections } from '../utils/mongoCollections'
import { userFromRequest } from '../utils/userFromRequestUtil';

import chartsListPage from '../templates/Chart.template'
import newChartPage from '../templates/NewChart.template'
import viewChartPage from '../templates/ViewChart.template';

import { handleNumberStringInput } from '../utils/inputHandlers'

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
      let chartTitle;
      const { dataDb, appDb } = req.app.locals
      const { chart_id } = req.params
      const { access } =  await appDb
        .collection(collections.users)
        .findOne(
          { uid: req.user },
          { _id: 0, access: 1 }
        )
      const siteAndAssessmentSubjects = [
        {
          $match : { _id : new ObjectID(chart_id) }
        },
        {
          $project : {
            _id : 0.0,
            assessment : 1.0,
            variable : 1.0,
            fieldLabelValueMap : 1.0,
            title : 1.0
          }
        }, 
        {
          $lookup : {
            from : 'toc',
            localField : 'assessment',
            foreignField : 'assessment',
            as : 'tocList',
              pipeline : [
                {
                  $match : {
                    study : {
                      $not : {
                          $eq : 'files'
                        },
                      $in: access
                    }
                  }
                },
                {
                  $project : {
                    collection : 1.0,
                    subject : 1.0,
                    study : 1.0,
                    _id : 0.0
                  }
                }
              ]
            }
          }, 
          {
            $unwind : { path : '$tocList' }
          }, 
          {
            $unwind : { path : '$fieldLabelValueMap' }
          }
      ]
      const individualCountsList = []
      const result = await dataDb.collection(collections.charts)
        .aggregate(siteAndAssessmentSubjects)
        .toArray()
      for await (const dcmnt of result) {
        const { 
          fieldLabelValueMap: { 
            value, 
            label 
          }, 
          tocList: { 
            collection, 
            study 
          }, 
          variable, 
          title 
        } = dcmnt

        if(!chartTitle) chartTitle = title
        const subjectDocumentCount = [
          {
            $match : {
              [variable] : handleNumberStringInput(value)
            }
          }, 
          {
            $group : {
              _id : study,
              count : { $sum : 1.0 }
            }
          }
        ]
        await dataDb
          .collection(collection)
          .aggregate(subjectDocumentCount)
          .forEach(({ _id, count }) => individualCountsList.push({ siteName: _id, count, fieldLabel: label }));
      }
      
      const data = Object
        .values(individualCountsList
        .reduce(function (currentSiteData, nextSiteData) {
          currentSiteData[nextSiteData.fieldLabel] = currentSiteData[nextSiteData.fieldLabel] || [];
          currentSiteData[nextSiteData.fieldLabel].push(nextSiteData);
          return currentSiteData;
        }, {}))
        .map((groupedCounts) => 
          Object
          .values(groupedCounts
            .reduce((currentSite, nextSite) => {
              currentSite[nextSite.siteName] = currentSite[nextSite.siteName]
              ? { ...nextSite, count: nextSite.count + currentSite[nextSite.siteName].count }
              : nextSite;
              return currentSite;
            }, {}))
        )
      const user = userFromRequest(req)
      const graph = { chart_id, data, title: chartTitle }

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
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const chartList = await dataDb
        .collection(collections.charts)
        .find({ owner: req.user })
        .toArray()

      return res.status(200).json({ data: chartList })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    }
  })
  
  router.route('/api/v1/charts/:chart_id')
    .delete(ensureAuthenticated, async (req, res) => {
      try {
        const { chart_id } = req.params
        const { dataDb } = req.app.locals
        const deletedChart = await dataDb
          .collection(collections.charts)
          .deleteOne({ _id: ObjectID(chart_id) })

        if (deletedChart.deletedCount > 0) {
          return res.status(200).json({ data: deletedChart.deletedCount });
        } else {
          return res.status(400).json({ message: 'Chart information not found' });
        }
      } catch (error) {
        console.error(error)

        return res.status(500).json({ message: error.message })
      }
    })

export default router
