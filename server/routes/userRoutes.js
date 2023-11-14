import express from 'express'

import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserByID,
    updateUserByID,
    deleteUser,
} from '../controller/userController.js'

import { getLogs, getAllLogs } from '../controller/logController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/logs').get(protect, admin, getAllLogs)
router.route('/logs/:id').get(protect, admin, getLogs)

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/logout', logoutUser)
router.post('/auth', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserByID)
    .put(protect, admin, updateUserByID)

export default router