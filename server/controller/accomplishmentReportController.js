import jwt from 'jsonwebtoken'
import asyncHandler from '../middleware/asyncHandler.js'
import AccomplishmentReport from '../models/AccomplishmentReport.js'
import User from '../models/User.js';
import path from 'path'

// @desc    Get all accomplishment reports
// @route   GET /api/accomplishments-reports/
// @access  Private/Admin


const imagesFolder = path.resolve("public/images");

const getAccomplishmentReports = asyncHandler(async (req, res) => {
    const { type } = req.query;
    if(type) {
        const accomplishmentReports = await AccomplishmentReport.find({type: type}).sort({_id: -1});
        res.status(200).json(accomplishmentReports)
    } else {
        const accomplishmentReports = await AccomplishmentReport.find({}).sort({_id: -1});
        res.status(200).json(accomplishmentReports)
    }

})

const storeAccomplishmentReports = asyncHandler(async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const {
        title,
        link,
    } = req.body;

    let userFile = null;

    if(req.files) {
        const { file } = req.files;
        const filePath = path.join(imagesFolder, file.name);
    
        file.mv(filePath);

        userFile = {
            fileName: file.name,
            filePath: `images/${file.name}`
        }
    }

    try {
        const createdAccomplishmentReport = await AccomplishmentReport.create({
            user: decoded.userId,
            title,
            file: userFile,
            link,
            type: decoded.userRole,
        });

        const newAccomplishmentReport = {
            _id: createdAccomplishmentReport._id,
            title: createdAccomplishmentReport.title,
            file: createdAccomplishmentReport.file,
            link: createdAccomplishmentReport.link,
            type: createdAccomplishmentReport.type
        }

        res.status(201).json(newAccomplishmentReport);
    } catch(error) {
        res.status(400)
        throw new Error(error)
    }
})

const getAccomplishmentReportsPerUser = asyncHandler(async (req, res) => {
    const {user} = req.query;

    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const accomplishmentReports = await AccomplishmentReport.find({user: user ?? decoded.userId}).sort({_id: -1});
        res.status(201).json(accomplishmentReports);
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }

})

const getAccomplishmentReportPerId = asyncHandler(async (req, res) => {
    const {id} = req.params;

    try{
        const accomplishmentReport = await AccomplishmentReport.findOne({_id: id}).populate('user', '_id firstName middleName lastName email');
        res.status(201).json(accomplishmentReport);
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }
})


export { getAccomplishmentReports, storeAccomplishmentReports, getAccomplishmentReportsPerUser, getAccomplishmentReportPerId }
