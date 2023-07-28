import { createHash } from 'crypto'
import _ from 'lodash'
import CollectionsModel from '../../models/CollectionsModel'
import MetadataModel from '../../models/MetadataModel'
import DashboardDataProcessor from '../../data_processors/DashboardDataProcessor'

class DashboardService {
  #assessmentKey = 'analysis'
  #consentDateKey = 'Consent Date'
  #consentKey = 'Consent'
  #hex = 'hex'
  #role = 'metadata'
  #salt = 'sha256'
  #subjectKey = 'Subject ID'

  constructor(dataDb, study, subject, configuration) {
    this.configuration = configuration
    this.consentDate = ''
    this.db = dataDb
    this.study = study
    this.subject = subject
  }

  #assessmentsFromConfig = () =>
    _.uniqBy(this.configuration, this.#assessmentKey).map(({ analysis }) => {
      const collectionName = this.study + this.subject + analysis
      return {
        assessment: analysis,
        collection: createHash(this.#salt)
          .update(collectionName)
          .digest(this.#hex),
      }
    })

  #setConsentDate = async () => {
    const metadocAttributes = {
      study: this.study,
      role: this.#role,
    }
    const metadata = await MetadataModel.findOne(this.db, metadocAttributes)

    if (!!metadata) {
      if (metadata.collection) {
        const { collection } = metadata
        const metadocuments = await CollectionsModel.all(this.db, collection)

        metadocuments.forEach((document) => {
          if (
            document[this.#subjectKey] === this.subject &&
            (document[this.#consentKey] || document[this.#consentDateKey])
          ) {
            this.consentDate =
              document[this.#consentKey] || document[this.#consentDateKey]
          }
        })
      }
    }
  }

  createDashboard = async () => {
    await this.#setConsentDate()

    const assessmentsFromConfig = this.#assessmentsFromConfig()
    const dashboardDataProcessor = new DashboardDataProcessor(
      assessmentsFromConfig,
      this.configuration,
      this.db
    )
    const { matrixData } = await dashboardDataProcessor.calculateDashboardData()

    return { consentDate: this.consentDate, matrixData }
  }
}

export default DashboardService
