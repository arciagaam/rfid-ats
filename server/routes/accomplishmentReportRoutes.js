import express from 'express'

// import { getRfids, storeRfid, deleteRfid, getRfidFromReader, changeWindowState } from '../controller/rfidController.js'
import { getAccomplishmentReports, storeAccomplishmentReports } from '../controller/accomplishmentReportController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router
    .route('/')
    .get(protect, admin, getAccomplishmentReports)
    // .put(protect, admin, storeAccomplishmentReports)
    .post(protect, admin, storeAccomplishmentReports)

// router.route('/window').post(protect, admin, changeWindowState)
// router.route('/:id').delete(protect, admin, deleteRfid)

export default router
