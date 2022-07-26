import { handleNumberStringInput } from '../utils/inputHandlers'
import { ObjectID } from 'mongodb';

export const siteAndAssessmentSubjects = (chart_id, userAccess) => [
  {
    $match : { _id : new ObjectID(chart_id) }
  },
  {
    $project : {
      _id : 0.0,
      assessment : 1.0,
      variable : 1.0,
      fieldLabelValueMap : 1.0,
      title : 1.0,
      description: 1.0
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
                $in: userAccess
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

export const subjectDocumentCount = (variable, value, study) => [
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

export const legendQuery = (chart_id) => [
  {
    $match : { _id : new ObjectID(chart_id) }
  },
  {
    $project : {
      _id : 0.0,
      fieldLabelValueMap : 1.0,
    }
  },
  {
    $unwind: { path: '$fieldLabelValueMap' }
  }
]
