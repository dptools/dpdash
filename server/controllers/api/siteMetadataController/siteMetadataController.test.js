import SiteMetadataController from '.'
import {
  createRequest,
  createResponse,
  createSiteMetadata,
} from '../../../../test/fixtures'

describe('siteMetadataController', () => {
  describe(SiteMetadataController.create, () => {
    describe('When new data is imported', () => {
      let appDb

      beforeAll(() => {
        appDb = global.MONGO_INSTANCE.db('siteMetadata')
      })
      beforeEach(async () => {
        await appDb.createCollection('metadata')
      })
      afterEach(async () => {
        await appDb.collection('metadata').drop()
      })
      afterAll(async () => {
        await appDb.dropDatabase()
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
            {
              participant: 'CA1',
              Active: 4,
              Consent: '2022-06-02',
              study: 'CA',
            },
            {
              participant: 'CA2',
              Active: 3,
              Consent: '2022-06-02',
              study: 'CA',
            },
          ],
        })
        const request = createRequest({
          body,
          app: { locals: { appDb } },
        })
        const response = createResponse()

        await SiteMetadataController.create(request, response)

        const newDocumentCount = await appDb
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
            {
              participant: 'LA3',
              Active: 5,
              Consent: '2022-06-02',
              study: 'LA',
            },
          ],
        })
        const request = createRequest({
          body,
          app: { locals: { appDb: appDb } },
        })
        const response = createResponse()

        await SiteMetadataController.create(request, response)

        const updatedSiteMetadata = await appDb
          .collection('metadata')
          .findOne({ participants: { $elemMatch: { participant: 'LA3' } } })

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
            {
              participant: 'YA1',
              Active: 4,
              Consent: '2022-06-02',
              study: 'YA',
            },
            {
              participant: 'YA2',
              Active: 3,
              Consent: '2022-06-02',
              study: 'YA',
            },
          ],
        })
        const request = createRequest({
          body,
          app: { locals: { appDb: appDb } },
        })
        const response = createResponse()

        await SiteMetadataController.create(request, response)

        const updatedDocs = await appDb
          .collection('metadata')
          .findOne({ study: 'YA' })

        expect(updatedDocs.participants).toEqual([
          {
            participant: 'YA1',
            Active: 4,
            Consent: new Date('2022-06-02'),
            study: 'YA',
          },
          {
            participant: 'YA2',
            Active: 3,
            Consent: new Date('2022-06-02'),
            study: 'YA',
          },
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
            {
              participant: 'YA1',
              Active: 1,
              Consent: '2022-06-02',
              study: 'YA',
            },
            {
              participant: 'YA2',
              Active: 1,
              Consent: '2022-06-02',
              study: 'YA',
            },
          ],
        })

        const request = createRequest({
          body,
        })
        const response = createResponse()

        request.app.locals.appDb.findOne.mockResolvedValueOnce(null)
        request.app.locals.appDb.findOneAndUpdate.mockImplementation()

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
            {
              participant: 'YA1',
              Active: 1,
              Consent: '2022-06-02',
              study: 'YA',
            },
            {
              participant: 'YA2',
              Active: 1,
              Consent: '2022-06-02',
              study: 'YA',
            },
          ],
        })

        const request = createRequest({ body })
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
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
  describe(SiteMetadataController.destroy, () => {
    describe('When successful', () => {
      let appDb

      beforeAll(() => {
        appDb = global.MONGO_INSTANCE.db('dpdata')
      })
      beforeEach(async () => {
        await appDb.createCollection('metadata')
      })
      afterAll(async () => {
        await appDb.dropDatabase()
      })

      it('removes the metadata collection', async () => {
        const request = createRequest()
        const response = createResponse()

        await SiteMetadataController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: 'Metadata collection restarted',
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 200 and an error', async () => {
        const request = createRequest()
        const response = createResponse()

        request.app.locals.appDb.collection.mockImplementation(() => {
          return {
            drop: jest.fn().mockRejectedValueOnce(new Error('some error')),
          }
        })
        await SiteMetadataController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          message: 'some error',
        })
      })
    })
  })
})
