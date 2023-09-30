import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    //console.log(req.body)

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d', //! change to 3d in production
        })

        // Set JWT as HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })

        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    res.send('Register user')
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
    res.send('Get users')
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserByID = asyncHandler(async (req, res) => {
    res.send('Get user by ID')
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
    res.send('Delete user')
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
