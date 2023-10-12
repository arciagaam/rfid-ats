import express from "express";

import {
    getRfids,
    storeRfid
} from '../controller/rfidController.js'

import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/').get(protect, getRfids).put(protect, storeRfid)

export default router;