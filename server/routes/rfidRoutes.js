import express from "express";

import {
    getRfids,
    storeRfid,
    deleteRfid
} from '../controller/rfidController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/').get(protect, admin, getRfids).put(protect, admin, storeRfid)
router.route('/:id').delete(protect, admin, deleteRfid)

export default router;