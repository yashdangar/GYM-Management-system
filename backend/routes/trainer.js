const { Router } = require("express");
require('dotenv').config()

const trainerRouter = Router();
const { trainerModel} = require("../db");
const cloudinary = require('../cloudinaryConfig');
const z = require("zod");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

trainerRouter.post('/add', upload.single('profileImage'), async function (req, res) {
    const requiredBody = z.object({
        firstName: z.string().min(2, 'First name must be at least 2 characters').max(20, 'First name must be at most 20 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters').max(20, 'Last name must be at most 20 characters'),
        email: z.string().email('Invalid email address').min(3).max(50),
        dateJoined: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
        gender: z.enum(['male', 'female'], 'Invalid gender'),
        birthdate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid birthdate format'),
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

    const { firstName, lastName, email, dateJoined, gender, birthdate, phoneNumber, address, pincode, activeStatus, profileImage, cloudinaryId, secretKey } = req.body;

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

        // Create the trainer document
        const trainer = await trainerModel.create({
            firstName,
            lastName,
            email,
            dateJoined: new Date(dateJoined),
            gender,
            birthdate: new Date(birthdate),
            phoneNumber,
            address,
            pincode,
            activeStatus,
            profileImage: profileImageUrl,
            cloudinaryId: cloudinaryImageId
        });

        res.status(201).json({
            message: "Trainer added successfully",
            trainer,
        });
    } catch (error) {
        console.log("Secret Key: ", process.env.SECRET_KEY);
        res.status(500).json({
            message: "Failed to add Trainer",
            error: error.message,
        });
    }
});

trainerRouter.get("/person",async (req, res) => {
    const { id } = req.body;

    const trainer = await trainerModel.findOne({
        _id : id
    })
    res.json({
        trainer
    })
})

trainerRouter.get("/count",async (req,res)=>{
    const count = await trainerModel.countDocuments({});
    res.json({count});
})


module.exports = {trainerRouter};
