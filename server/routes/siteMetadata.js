import { Router } from 'express'

import SiteMetadataController from '../controllers/api/siteMetadataController'
import { ensureApiAuthenticated } from '../utils/passport/ensure-api-authenticated'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.siteMetadata.index)
  .post(ensureApiAuthenticated, SiteMetadataController.create)
  .delete(ensureApiAuthenticated, SiteMetadataController.destroy)

export default router
