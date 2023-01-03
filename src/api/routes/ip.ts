import express from 'express'

import { IpController } from '@api/controllers/ip.controller'

const router = express.Router()

router.post('/get', IpController.createEntry)
router.post('/destroy', IpController.deleteEntry)

export default router
