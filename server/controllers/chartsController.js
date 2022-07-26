import { collections } from '../utils/mongoCollections'
import {
  siteAndAssessmentSubjects,
  subjectDocumentCount,
  legendQuery,
} from '../aggregates/chartAggregates'

export const graphDataController = async (dataDb, userAccess, chart_id) => {
  let chartTitle;
  let chartDescription;
  const individualCountsList = []
  const sitesAndAssessments = await dataDb
    .collection(collections.charts)
    .aggregate(siteAndAssessmentSubjects(chart_id, userAccess))
    .toArray()

  for await (const dcmnt of sitesAndAssessments) {
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
      title,
      description
    } = dcmnt
    chartTitle ??= title
    chartDescription ??= description

    await dataDb
      .collection(collection)
      .aggregate(subjectDocumentCount(variable, value, study))
      .forEach(({ _id, count }) => individualCountsList.push({ siteName: _id, count, fieldLabel: label }));
  }

  return { 
    chartTitle, 
    chartDescription, 
    individualCountsList 
  }
}

export const fieldValuesController = async(dataDb, chart_id) => await dataDb
.collection(collections.charts)
.aggregate(legendQuery(chart_id))
.toArray()
