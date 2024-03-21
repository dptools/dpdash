import { collections } from '../../utils/mongoCollections'
import SiteMetadataModel from '../../models/SiteMetadataModel'
import DashboardDataProcessor from '../../data_processors/DashboardDataProcessor'

class DashboardService {
  constructor(appDb, study, participant, configuration) {
    this.configuration = configuration
    this.db = appDb
    this.study = study
    this.participant = participant
  }

  get assessmentsFromConfig() {
    const assessments = new Map()

    this.configuration.forEach((configuration) => {
      const key = this.study + this.participant + configuration.analysis

      if (!assessments.has(key)) assessments.set(key, configuration.analysis)
    })

    return [...assessments.values()]
  }

  consentDate = async () => {
    const query = {
      study: this.study,
    }

    const studyMetadata = await SiteMetadataModel.findOne(this.db, query)

    return studyMetadata.participants.filter(
      ({ participant }) => participant === this.participant
    )[0].Consent
  }

  dashboardDataCursor = async () =>
    await this.db
      .collection(collections.assessmentDayData)
      .find(
        {
          participant: this.participant,
          study: this.study,
          assessment: { $in: this.assessmentsFromConfig },
        },
        { projection: { dayData: 1, assessment: 1 } }
      )
      .stream()

  createMatrix = async () => {
    const dataStream = await this.dashboardDataCursor()
    const participantDataMap = new Map()

    dataStream.on('data', (doc) => {
      const dayData = doc?.dayData.length ? doc.dayData : []

      participantDataMap.set(doc.assessment, dayData)
    })

    await new Promise((resolve, reject) => {
      dataStream.on('end', () => resolve())

      dataStream.on('error', (err) => reject(err))
    })

    const dashboardProcessor = new DashboardDataProcessor(
      this.configuration,
      participantDataMap
    )

    return dashboardProcessor.calculateDashboardData()
  }
}

export default DashboardService
