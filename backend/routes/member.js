const { Router } = require("express");
require('dotenv').config()

const memberRouter = Router();
const { memberModel} = require("../db");
const cloudinary = require('../cloudinaryConfig');
const z = require("zod");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

memberRouter.post('/add', upload.single('profileImage'), async function (req, res) {
    const requiredBody = z.object({
        firstName: z.string().min(2, 'First name must be at least 2 characters').max(20, 'First name must be at most 20 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters').max(20, 'Last name must be at most 20 characters'),
        email: z.string().email('Invalid email address').min(3).max(50),
        membershipType: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
        dateJoined: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
        gender: z.enum(['male', 'female'], 'Invalid gender'),
        birthdate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid birthdate format'),
        membershipDate: z.string().refine(val => !isNaN(Date.parse(val))).optional(),

        phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
        address: z.string().min(5, 'Address is too short').max(100, 'Address is too long'),
        pincode: z.string().min(6, 'Pincode must be exactly 6 digits').max(6, 'Pincode must be exactly 6 digits').regex(/^\d+$/, 'Pincode should contain only digits'),
        activeStatus: z.boolean().optional(),
        profileImage: z.string().optional(),  // Optional profile image URL
        cloudinaryId: z.string().optional(),
        secretKey: z.string(),
    });

    // Validate request body
    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(404).json({
            message: "Incorrect format",
            error: validateBody.error,
        });
    }

    const { firstName, lastName, email, membershipType, dateJoined, gender, birthdate, phoneNumber, address, pincode, activeStatus, profileImage, cloudinaryId, secretKey,membershipDate } = req.body;

    // Check if the secret key matches
    if (secretKey !== process.env.SECRET_KEY) {
        return res.status(401).json({
            message: "Unauthorized access",
            error: "Invalid secret key",
        });
    }

    try {
        let profileImageUrl = profileImage;
        let cloudinaryImageId = cloudinaryId;

        // Upload profile image if it exists
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'gym-members',
            });
            profileImageUrl = result.secure_url;
            cloudinaryImageId = result.public_id;
        }

        // Create the member document
        const member = await memberModel.create({
            firstName,
            lastName,
            email,
            membershipType,
            dateJoined: new Date(dateJoined),
            gender,
            birthdate: new Date(birthdate),
            phoneNumber,
            address,
            pincode,
            activeStatus,
            membershipDate,
            profileImage: profileImageUrl,
            cloudinaryId: cloudinaryImageId
        });

        res.status(201).json({
            message: "Member added successfully",
            member,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add member",
            error: error.message,
        });
    }
});


memberRouter.get("/person",async (req, res) => {
    const { id } = req.body;

    const member = await memberModel.findOne({
        _id : id
    })
    res.json({
        member
    })
})
module.exports = {memberRouter};
