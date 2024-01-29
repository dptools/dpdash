import SiteMetadataController from '.'
import {
  createRequest,
  createResponse,
  createSiteMetadata,
} from '../../../../test/fixtures'

describe('siteMetadataController', () => {
  describe(SiteMetadataController.create, () => {
    describe('When new data is imported', () => {
      let dataDb

      beforeAll(() => {
        dataDb = global.MONGO_INSTANCE.db('dpdata')
      })
      beforeEach(async () => {
        await dataDb.createCollection('metadata')
      })
      afterEach(async () => {
        await dataDb.collection('metadata').drop()
      })
      afterAll(async () => {
        await dataDb.dropDatabase()
      })

      it('creates new metadata document', async () => {
        const body = createSiteMetadata({
          metadata: {
            filetype: 'text/csv',
            encoding: 'utf-8',
            dirname: '/path/to/files',
            mtime: 1234567890.0,
            size: 1024,
            uid: 1000,
            gid: 1000,
            mode: 420,
            role: 'metadata',
            study: 'CA',
            extension: '.csv',
          },
          participants: [
            { subject: 'CA1', Active: 4, Consent: '-', study: 'CA' },
            { subject: 'CA2', Active: 3, Consent: '-', study: 'CA' },
          ],
        })
        const request = createRequest({
          body,
          app: { locals: { dataDb: dataDb } },
        })
        const response = createResponse()

        await SiteMetadataController.create(request, response)

        const newDocumentCount = await dataDb
          .collection('metadata')
          .countDocuments({ study: 'CA' })

        expect(newDocumentCount).toEqual(1)
      })
      it('appends new participant when new data is imported but site metadata is present', async () => {
        const body = createSiteMetadata({
          metadata: {
            filetype: 'text/csv',
            encoding: 'utf-8',
            dirname: '/path/to/files',
            mtime: 1234567890.0,
            size: 1024,
            uid: 1000,
            gid: 1000,
            mode: 420,
            role: 'metadata',
            study: 'LA',
            extension: '.csv',
          },
          participants: [
            { subject: 'LA3', Active: 5, Consent: '-', study: 'LA' },
          ],
        })
        const request = createRequest({
          body,
          app: { locals: { dataDb: dataDb } },
        })
        const response = createResponse()

        await dataDb.collection('metadata').insertOne({
          filetype: 'text/csv',
          encoding: 'utf-8',
          dirname: '/path/to/files',
          mtime: 1234567890.0,
          size: 1024,
          uid: 1000,
          gid: 1000,
          mode: 420,
          role: 'metadata',
          study: 'LA',
          extension: '.csv',
          subjects: [
            { subject: 'LA1', Active: 1, Consent: '-', study: 'LA' },
            { subject: 'LA2', Active: 1, Consent: '-', study: 'LA' },
          ],
        })

        await SiteMetadataController.create(request, response)

        const updatedSiteMetadata = await dataDb
          .collection('metadata')
          .findOne({ subjects: { $elemMatch: { subject: 'LA3' } } })

        expect(updatedSiteMetadata).toBeDefined()
      })
      it('updates existing participant data', async () => {
        const body = createSiteMetadata({
          metadata: {
            filetype: 'text/csv',
            encoding: 'utf-8',
            dirname: '/path/to/files',
            mtime: 1234567890.0,
            size: 1024,
            uid: 1000,
            gid: 1000,
            mode: 420,
            role: 'metadata',
            study: 'YA',
            extension: '.csv',
          },
          participants: [
            { subject: 'YA1', Active: 4, Consent: '-', study: 'YA' },
            { subject: 'YA2', Active: 3, Consent: '-', study: 'YA' },
          ],
        })
        const request = createRequest({
          body,
          app: { locals: { dataDb: dataDb } },
        })
        const response = createResponse()

        await dataDb.collection('metadata').insertOne({
          filetype: 'text/csv',
          encoding: 'utf-8',
          dirname: '/path/to/files',
          mtime: 1234567890.0,
          size: 1024,
          uid: 1000,
          gid: 1000,
          mode: 420,
          role: 'metadata',
          study: 'YA',
          extension: '.csv',
          subjects: [
            { subject: 'YA1', Active: 1, Consent: '-', study: 'YA' },
            { subject: 'YA2', Active: 1, Consent: '-', study: 'YA' },
          ],
        })

        await SiteMetadataController.create(request, response)

        const updatedDocs = await dataDb
          .collection('metadata')
          .findOne({ study: 'YA' })

        expect(updatedDocs.subjects).toEqual([
          { subject: 'YA1', Active: 4, Consent: '-', study: 'YA' },
          { subject: 'YA2', Active: 3, Consent: '-', study: 'YA' },
        ])
      })
    })
    describe('When successful', () => {
      it('returns a status of 200 and a success data message', async () => {
        const body = createSiteMetadata({
          metadata: {
            filetype: 'text/csv',
            encoding: 'utf-8',
            dirname: '/path/to/files',
            mtime: 1234567890.0,
            size: 1024,
            uid: 1000,
            gid: 1000,
            mode: 420,
            role: 'metadata',
            study: 'site',
            extension: '.csv',
          },
          participants: [
            { subject: 'YA1', Active: 1, Consent: '-', study: 'YA' },
            { subject: 'YA2', Active: 1, Consent: '-', study: 'YA' },
          ],
        })

        const request = createRequest({
          body,
        })
        const response = createResponse()

        request.app.locals.dataDb.findOne.mockResolvedValueOnce(null)
        request.app.locals.dataDb.findOneAndUpdate.mockImplementation()

        await SiteMetadataController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: 'Metadata imported successfully.',
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 200 and a success data message', async () => {
        const body = createSiteMetadata({
          metadata: {
            filetype: 'text/csv',
            encoding: 'utf-8',
            dirname: '/path/to/files',
            mtime: 1234567890.0,
            size: 1024,
            uid: 1000,
            gid: 1000,
            mode: 420,
            role: 'metadata',
            study: 'site',
            extension: '.csv',
          },
          participants: [
            { subject: 'YA1', Active: 1, Consent: '-', study: 'YA' },
            { subject: 'YA2', Active: 1, Consent: '-', study: 'YA' },
          ],
        })

        const request = createRequest({ body })
        const response = createResponse()

        request.app.locals.dataDb.findOne.mockRejectedValueOnce(
          new Error('some error')
        )

        await SiteMetadataController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(401)
        expect(response.json).toHaveBeenCalledWith({
          message: 'some error',
        })
      })
    })
  })
})
