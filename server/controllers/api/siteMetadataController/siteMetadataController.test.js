import SiteMetadataController from '.'
import {
  createRequest,
  createResponse,
  createSiteMetadata,
} from '../../../../test/fixtures'

describe('siteMetadataController', () => {
  describe(SiteMetadataController.create, () => {
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
            { 'Subject ID': 'YA1', Active: 1, Consent: '-', Study: 'YA' },
            { 'Subject ID': 'YA2', Active: 1, Consent: '-', Study: 'YA' },
          ],
        })

        const request = createRequest({ body })
        const response = createResponse()

        request.app.locals.dataDb.findOneAndUpdate.mockResolvedValueOnce()

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
            { 'Subject ID': 'YA1', Active: 1, Consent: '-', Study: 'YA' },
            { 'Subject ID': 'YA2', Active: 1, Consent: '-', Study: 'YA' },
          ],
        })

        const request = createRequest({ body })
        const response = createResponse()

        request.app.locals.dataDb.findOneAndUpdate.mockRejectedValueOnce(
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
