import { Router } from 'express'
import SiteMetadataController from '../controllers/api/siteMetadataController'
import { v1Routes } from '../utils/routes'
import { ensureApiAuthenticated } from '../utils/passport/ensure-api-authenticated'

const router = Router()

router
  .route(v1Routes.siteMetadata.index)
  .post(ensureApiAuthenticated, SiteMetadataController.create)
  .delete(ensureApiAuthenticated, SiteMetadataController.destroy)

export default router
