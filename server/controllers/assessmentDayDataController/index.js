import AssessmentDayDataModel from '../../models/AssessmentDayDataModel'
import ToCModel from '../../models/ToC'
import AssessmentDayDataService from '../../services/AssessmentDayDataService'

const AssessmentDayDataController = {
  create: async (req, res) => {
    try {
      const { dataDb } = req.app.locals

      const { metadata, subject_assessments } = req.body

      if (!metadata || !subject_assessments.length)
        return res.status(400).json({ message: 'Nothing to import' })

      const { assessment, subject, collection } = metadata
      const query = {
        assessment,
        subject,
      }
      const storedAssessmentData = await AssessmentDayDataModel.all(
        dataDb,
        collection
      )
      const assessmentDataService = new AssessmentDayDataService(
        subject_assessments,
        storedAssessmentData
      )
      const newAssessmentData = assessmentDataService.filterNewData()
      const updatedData = assessmentDataService.filterUpdatedData()

      await ToCModel.upsert(dataDb, query, metadata)

      if (newAssessmentData.length)
        await AssessmentDayDataModel.saveMany(
          dataDb,
          collection,
          newAssessmentData
        )
      for await (const participantData of updatedData) {
        const { day } = participantData

        await AssessmentDayDataModel.update(
          dataDb,
          collection,
          { day },
          participantData
        )
      }

      return res.status(200).json({ data: 'Imported successfully' })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  },
}

export default AssessmentDayDataController
