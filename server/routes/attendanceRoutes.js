import express from 'express'

import { protect, admin } from '../middleware/authMiddleware'

const router = express.Router()

router.route('/')
.get(protect, admin, )