import express from 'express'

import { getRfids, storeRfid, deleteRfid, getRfidFromReader } from '../controller/rfidController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router
    .route('/')
    .get(protect, admin, getRfids)
    .put(protect, admin, storeRfid)
    .post(getRfidFromReader)
router.route('/:id').delete(protect, admin, deleteRfid)

export default router
