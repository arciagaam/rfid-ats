import express from 'express'

// import { getRfids, storeRfid, deleteRfid, getRfidFromReader, changeWindowState } from '../controller/rfidController.js'
import { getAccomplishmentReports, storeAccomplishmentReports, getAccomplishmentReportsPerUser, getAccomplishmentReportPerId } from '../controller/accomplishmentReportController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router
    .route('/')
    .get(protect, getAccomplishmentReports)
    .post(protect, storeAccomplishmentReports)

router
    .route('/per-user')
    .get(protect, getAccomplishmentReportsPerUser);
    
router
    .route('/:id')
    .get(protect, getAccomplishmentReportPerId)


// router.route('/window').post(protect, admin, changeWindowState)
// router.route('/:id').delete(protect, admin, deleteRfid)

export default router
