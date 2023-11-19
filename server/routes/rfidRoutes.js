import express from 'express'

import {
    getRfids,
    storeRfid,
    deleteRfid,
    getRfidFromReader,
    changeWindowState,
    assignRfidToUser,
} from '../controller/rfidController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/window').post(changeWindowState)
router.post('/add', storeRfid)

router.route('/').get(protect, admin, getRfids).post(getRfidFromReader)

router.route('/:id').delete(protect, admin, deleteRfid)
router.route('/assign').put(protect, admin, assignRfidToUser)

export default router
