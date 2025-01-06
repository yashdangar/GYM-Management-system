const { Router } = require("express");
require('dotenv').config()

const trainerRouter = Router();
const { trainerModel } = require("../db");
const cloudinary = require('../cloudinaryConfig');
const z = require("zod");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

trainerRouter.post('/add', upload.single('profileImage'), async function (req, res) {
    const requiredBody = z.object({
        name: z.string().min(2, 'First name must be at least 2 characters').max(20, 'First name must be at most 20 characters'),
        email: z.string().email('Invalid email address').min(3).max(50),
        datejoined: z.string().optional(),
        gender: z.enum(['male', 'female'], 'Invalid gender'),
        birthdate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid birthdate format'),
        phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
        address: z.string().min(5, 'Address is too short').max(100, 'Address is too long').optional(),
        pincode: z.string().min(6, 'Pincode must be exactly 6 digits').max(6, 'Pincode must be exactly 6 digits').regex(/^\d+$/, 'Pincode should contain only digits').optional(),
        status: z.string().optional(),
        profileImage: z.string().optional(),
        cloudinaryId: z.string().optional(),
        secretKey: z.string(),
    });

    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(404).json({
            message: "Incorrect format",
            error: validateBody.error,
        });
    }

    const { name, email, datejoined, gender, birthdate, phoneNumber, address, pincode, status, profileImage, cloudinaryId, secretKey } = req.body;

    if (secretKey !== process.env.SECRET_KEY) {
        return res.json({
            message: "Invalid secret key"
        });
    }

    try {
        let profileImageUrl = profileImage;
        let cloudinaryImageId = cloudinaryId;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'gym-trainers',
            });
            profileImageUrl = result.secure_url;
            cloudinaryImageId = result.public_id;
        }

        const validDateJoined = datejoined && !isNaN(new Date(datejoined)) ? new Date(datejoined) : new Date();
        const validBirthdate = birthdate && !isNaN(new Date(birthdate)) ? new Date(birthdate) : null;

        const trainer = await trainerModel.create({
            img: profileImageUrl,
            name,
            email,
            datejoined: validDateJoined,
            gender,
            birthdate: validBirthdate,
            phonenumber: phoneNumber,
            address,
            pincode,
            status,
            cloudinaryId: cloudinaryImageId
        });

        res.status(201).json({
            message: "Trainer added successfully",
            trainer,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to add Trainer",
            error: error,
        });
    }
});

trainerRouter.put('/edit/:id', upload.single('profileImage'), async function (req, res) {
    const requiredBody = z.object({
        name: z.string().min(2, 'First name must be at least 2 characters').max(20, 'First name must be at most 20 characters'),
        email: z.string().email('Invalid email address').min(3).max(50),
        dateJoined: z.string().optional(),
        gender: z.enum(['male', 'female'], 'Invalid gender'),
        birthdate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid birthdate format'),
        phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
        address: z.string().min(5, 'Address is too short').max(100, 'Address is too long').optional(),
        pincode: z.string().min(6, 'Pincode must be exactly 6 digits').max(6, 'Pincode must be exactly 6 digits').regex(/^\d+$/, 'Pincode should contain only digits').optional(),
        status: z.string().optional(),
        profileImage: z.string().optional(),
        cloudinaryId: z.string().optional(),
        secretKey: z.string(),
    });

    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(400).json({
            message: "Incorrect format",
            error: validateBody.error,
        });
    }

    const { id } = req.params;

    const {
        name, email, dateJoined, gender, birthdate, phonenumber,
        address, pincode, status, profileImage, cloudinaryId, secretKey,
    } = req.body;

    if (secretKey !== process.env.SECRET_KEY) {
        return res.json({
            message: "Invalid secret key"
        });
    }

    try {
        const existingTrainer = await trainerModel.findById(id);

        if (!existingTrainer) {
            return res.status(404).json({
                message: "Trainer not found",
            });
        }

        let profileImageUrl = profileImage || existingTrainer.img;
        let cloudinaryImageId = cloudinaryId || existingTrainer.cloudinaryId;

        if (req.file) {
            if (existingTrainer.cloudinaryId) {
                await cloudinary.uploader.destroy(existingTrainer.cloudinaryId);
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'gym-trainers',
            });
            profileImageUrl = result.secure_url;
            cloudinaryImageId = result.public_id;
        }

        existingTrainer.set({
            img: profileImageUrl,
            name,
            datejoined: dateJoined ? new Date(dateJoined) : existingTrainer.dateJoined,
            gender,
            birthdate: birthdate ? new Date(birthdate) : existingTrainer.birthdate,
            address,
            pincode,
            status,
            cloudinaryId: cloudinaryImageId,
        });

        await existingTrainer.save();

        res.status(200).json({
            message: "Trainer updated successfully",
            trainer: existingTrainer,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update Trainer",
            error: error.message,
        });
    }
});

trainerRouter.get("/all", async (req, res) => {
    const trainers = await trainerModel.find();
    res.json({
        trainers
    })
})

trainerRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const requiredBody = z.object({
        secretKey: z.string(),
    })
    const validateBody = requiredBody.safeParse(req.body);
    if (!validateBody.success) {
        return res.status(400).json({
            message: "Incorrect format",
            error: validateBody.error,
        });
    }
    const { secretKey } = req.body;
    if (secretKey !== process.env.SECRET_KEY) {
        return res.json({
            message: "Invalid secret key"
        });
    }
    try {
        const trainer = await trainerModel.findById(id);

        if (!trainer) {
            return res.status(404).json({
                message: "Trainer not found",
            });
        }

        await trainerModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Trainer deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete Trainer",
            error: error.message,
        });
    }
});

trainerRouter.get("/person/:id", async (req, res) => {
    const { id } = req.params;

    const trainer = await trainerModel.findOne({
        _id: id
    })
    res.json({
        trainer
    })
})

trainerRouter.get("/count", async (req, res) => {
    const count = await trainerModel.countDocuments({});
    res.json({ count });
})


module.exports = { trainerRouter };
