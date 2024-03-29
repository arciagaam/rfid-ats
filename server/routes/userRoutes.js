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
    attachUserSchedule,
    getUsersWithSchedule,
} from '../controller/userController.js'

import { getLogs, getAllLogs, getAllLogsByDate } from '../controller/logController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/logs').get(protect, admin, getAllLogs).post(protect, getAllLogsByDate)

router.route('/logs/:id').get(protect, getLogs)

router.route('/').post(protect, registerUser).get(protect, admin, getUsers)
router.post('/logout', logoutUser)
router.post('/auth', authUser)

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)

router
    .route('/schedule')
    .post(protect, admin, attachUserSchedule)
    .get(protect, admin, getUsersWithSchedule)

router.route('/').get(protect, admin, attachUserSchedule)

router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserByID)
    .put(protect, admin, updateUserByID)

export default router
