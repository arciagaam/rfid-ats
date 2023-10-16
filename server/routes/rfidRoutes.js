import express from 'express'

import { getRfids, storeRfid, deleteRfid, getRfidFromReader, storeRfidWindow } from '../controller/rfidController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router
    .route('/')
    .get(protect, admin, getRfids)
    .put(protect, admin, storeRfid)
    .post(getRfidFromReader)

router.route('/open').get(protect, admin, storeRfidWindow)
router.route('/:id').delete(protect, admin, deleteRfid)

export default router
