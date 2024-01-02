import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/User.js'
import Rfid from './../models/Rfid.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user)

        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            department: user.department,
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
const registerUser = asyncHandler(async(req, res) => {
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

    const userRfid = await Rfid.findById(rfid)

    const user = await User.create({
        firstName,
        middleName,
        lastName,
        email,
        password,
        role,
        department: req.user.department,
        status,
        idNumber,
        rfid: userRfid ? userRfid.rfidTag : null,
        birthdate,
        sex,
        contactNumber,
        address,
    })

    if (rfid) {
        userRfid.user = user._id
        userRfid.status = 'active'

        await userRfid.save()
    }

    if (user) {
        req.io.emit('new_user', { message: 'new user created' })
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
const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })

    res.status(200).json({ message: 'Logged out successfully' })
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.role,
            department: user.department,
            status: user.status,
            idNumber: user.idNumber,
            rfid: user.rfid,
            birthdate: user.birthdate,
            sex: user.sex,
            contactNumber: user.contactNumber,
            address: user.address,
            schedule: user.schedule,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const {
        firstName,
        middleName,
        lastName,
        email,
        password,
        role,
        department,
        idNumber,
        rfid,
        birthdate,
        sex,
        contactNumber,
        address,
    } = req.body

    const user = await User.findById(req.user._id)

    console.log("user profile", user)
    console.log("new password", password)

    if (user) {
        if (rfid) {
            const userRfid = await Rfid.findOne({ rfidTag: rfid })
            user.rfid = userRfid.rfidTag
        }

        user.firstName = firstName || user.firstName
        user.middleName = middleName || user.middleName
        user.lastName = lastName || user.lastName
        user.email = email || user.email
        user.contactNumber = contactNumber || user.contactNumber
        user.role = role || user.role
        user.department = department || user.department
        user.idNumber = idNumber || user.idNumber
        user.birthdate = birthdate || user.birthdate
        user.sex = sex || user.sex
        user.contactNumber = contactNumber || user.contactNumber
        user.address = address || user.address

        if (password) {
            user.password = password
        }

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            middleName: updatedUser.middleName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            contactNumber: updatedUser.contactNumber,
            role: updatedUser.role,
            department: updatedUser.department,
            idNumber: updatedUser.idNumber,
            rfid: updatedUser.rfid,
            birthdate: updatedUser.birthdate,
            sex: updatedUser.sex,
            address: updatedUser.address,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async(req, res) => {
    const { role, search } = req.query

    if (search && role) {
        const users = await User.find({
                role: role,
                $expr: {
                    $regexMatch: {
                        input: { $concat: ['$firstName', ' ', '$middleName', ' ', '$lastName'] },
                        regex: search, //Your text search here
                        options: 'im',
                    },
                },
            })
            .where('department').eq(req.user.department)
            .sort({ _id: -1 })

        res.status(200).json(users)
        return
    }

    if (role) {
        const users = await User
            .where('role').eq(role)
            .where('department').eq(req.user.department)
            .sort({ _id: -1 })

        res.status(200).json(users)
        return
    }

    const users = await User
        .find({})
        .where('department').eq(req.user.department)
        .sort({ _id: -1 })

    res.status(200).json(users)
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserByID = asyncHandler(async(req, res) => {
    const token = req.cookies.jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id } = req.params

    const user = await User.findOne({ _id: id ?? decoded.userId })
    res.status(200).json(user)
})

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserByID = asyncHandler(async(req, res) => {
    const {
        firstName,
        middleName,
        lastName,
        email,
        password,
        role,
        department,
        idNumber,
        rfid,
        birthdate,
        sex,
        contactNumber,
        address,
        status,
    } = req.body

    const user = await User.findById(req.params.id)

    console.log("update user by id", user)
    console.log("new password", password)

    if (user) {
        if (rfid) {
            const userRfid = await Rfid.findOne({ rfidTag: rfid })
            user.rfid = userRfid.rfidTag
        }

        user.firstName = firstName || user.firstName
        user.middleName = middleName || user.middleName
        user.lastName = lastName || user.lastName
        user.email = email || user.email
        user.contactNumber = contactNumber || user.contactNumber
        user.role = role || user.role
        user.department = department || user.department
        user.idNumber = idNumber || user.idNumber
        user.birthdate = birthdate || user.birthdate
        user.sex = sex || user.sex
        user.contactNumber = contactNumber || user.contactNumber
        user.address = address || user.address
        user.status = status || user.status

        if (password) {
            user.password = password
        }

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            middleName: updatedUser.middleName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            contactNumber: updatedUser.contactNumber,
            role: updatedUser.role,
            department: updatedUser.department,
            idNumber: updatedUser.idNumber,
            rfid: updatedUser.rfid,
            birthdate: updatedUser.birthdate,
            sex: updatedUser.sex,
            address: updatedUser.address,
            status: updatedUser.status,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        const rfid = await Rfid.findOne({ rfidTag: user.rfid })

        if (rfid) {
            rfid.status = 'not assigned'
            rfid.user = null
            
            await rfid.save()
        }

        await User.deleteOne({ _id: user._id })
        res.status(200).json({ message: 'User deleted' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const attachUserSchedule = asyncHandler(async(req, res) => {
    const { userId, schedule } = req.body

    const user = await User.findById(userId)
    if (user) {
        user.schedule = schedule

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            middleName: updatedUser.middleName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            contactNumber: updatedUser.contactNumber,
            role: updatedUser.role,
            department: updatedUser.department,
            idNumber: updatedUser.idNumber,
            rfid: updatedUser.rfid,
            birthdate: updatedUser.birthdate,
            sex: updatedUser.sex,
            address: updatedUser.address,
            status: updatedUser.status,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const getUsersWithSchedule = asyncHandler(async(req, res) => {
    const user = await User.find({ schedule: { $ne: null } }).where('department').eq(req.user.department).select('-password')

    if (user) {
        res.status(200).json(user)
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
    attachUserSchedule,
    getUsersWithSchedule,
}