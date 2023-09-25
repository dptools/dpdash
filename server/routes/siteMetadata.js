import { Router } from 'express'
import SiteMetadataController from '../controllers/siteMetadataController'
import { v1Routes } from '../utils/routes'

const router = Router()

router.route(v1Routes.siteMetadata.index).post(SiteMetadataController.create)

export default router
