import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import bcrypt from 'bcrypt'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id)

        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Register user
// @route   POST /api/users
// @access  Private/Admin
const registerUser = asyncHandler(async (req, res) => {
    const {
        firstName,
        middleName,
        lastName,
        email,
        password,
        role,
        department,
        status,
        idNumber,
        rfid,
        birthdate,
        sex,
        contactNumber,
        address,
    } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        firstName,
        middleName,
        lastName,
        email,
        password,
        role,
        department,
        status,
        idNumber,
        rfid,
        birthdate,
        sex,
        contactNumber,
        address,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            department: user.department,
            status: user.status,
            idNumber: user.idNumber,
            rfid: user.rfid,
            birthdate: user.birthdate,
            sex: user.sex,
            contactNumber: user.contactNumber,
            address: user.address,
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })

    res.status(200).json({ message: 'Logged out successfully' })
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.firstName = req.body.firstName || user.firstName
        user.middleName = req.body.middleName || user.middleName
        user.lastName = req.body.lastName || user.lastName
        user.email = req.body.email || user.email
        user.role = req.body.role || user.role
        user.status = req.body.status || user.status

        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            middleName: updatedUser.middleName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserByID = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await User.findOne({ _id: id })
    res.status(200).json(user)
})

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserByID = asyncHandler(async (req, res) => {
    res.send('Update user by ID')
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        await User.deleteOne({ _id: user._id })
        res.status(200).json({ message: 'User deleted' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserByID,
    updateUserByID,
    deleteUser,
}
