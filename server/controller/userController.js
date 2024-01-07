import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/User.js'
import Rfid from './../models/Rfid.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import fs from 'fs'


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
        profilePicture
    } = req.body

    let profilePicturePath = ''

    if(profilePicture) {
        const base64 = profilePicture;
        if (base64 === undefined) return;

        const buffer = convertBase64toBuffer(base64);
        const fileName = `${v4()}.${getBase64FileType(base64)}`;

        storeFile('./public/images', fileName, buffer);

        profilePicturePath = fileName;
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }    

    const userRfid = await Rfid.findOne({ rfidTag: rfid })

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
        profilePicture: profilePicturePath,
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
            profilePicture: user.profilePicture
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
            profilePicture: user.profilePicture
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
        profilePicture
    } = req.body

    const user = await User.findById(req.user._id)

    // console.log("user profile", user)
    // console.log("new password", password)

    let profilePicturePath = ''
    if(profilePicture) {
        const base64 = profilePicture;
        if (base64 === undefined) return;

        const buffer = convertBase64toBuffer(base64);
        const fileName = `${v4()}.${getBase64FileType(base64)}`;

        storeFile('./public/images', fileName, buffer);

        profilePicturePath = fileName;
    }

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
        user.profilePicture = profilePicturePath || user.profilePicture

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
            profilePicture: updatedUser.profilePicture
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
        profilePicture
    } = req.body

    const user = await User.findById(req.params.id)

    console.log("update user by id", user)
    console.log("new password", password)

    
    let profilePicturePath = ''

    if(profilePicture) {
        const base64 = profilePicture;
        if (base64 === undefined) return;

        const buffer = convertBase64toBuffer(base64);
        const fileName = `${v4()}.${getBase64FileType(base64)}`;

        storeFile('./public/images', fileName, buffer);

        profilePicturePath = fileName;
    }

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
        user.profilePicture = profilePicturePath || user.profilePicture

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
            profilePicture: updatedUser.profilePicture,
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

function convertObjectKeys(value) {
    const _obj = new Object;

    if (value instanceof Array) {
        const arrOfObj = [];

        for (const obj of value) {
            arrOfObj.push(convertObjectKeys(obj));
        }

        return arrOfObj;
    } else {
        for (const key in value) {
            const _key = convertKeyToCamelCase(key);
            let _val = value[key];

            if (value[key] instanceof Array) {
                _val = convertObjectKeys(_val);
            }

            Object.assign(_obj, { [_key]: _val })
        }
    }

    return _obj;
}

function convertBase64toBlob(base64Data) {
    const parts = base64Data.split(',');
    const contentType = parts[0].split(':')[1].split(';')[0];
    const base64 = parts[1];
    const decodedData = atob(base64);
    const arrayBuffer = new ArrayBuffer(decodedData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < decodedData.length; i++) {
        uint8Array[i] = decodedData.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: contentType });
}

function storeFile(dest, name, buffer) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    try {
        fs.writeFileSync(`${dest}/${name}`, buffer);
    } catch (error) {
        console.log(error);
    }
}

function getBase64FileType(base64) {
    try {
        return base64.substring("data:image/".length, base64.indexOf(";base64"));
    } catch (error) {
        return "";
    }
}

export function mimeToExtension(mime) {
    return "." + mime.split('/')[1];
}

export function convertBase64toBuffer(base64Value) {
    const base64 = base64Value.split(',')[1];
    return Buffer.from(base64, "base64");
}

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