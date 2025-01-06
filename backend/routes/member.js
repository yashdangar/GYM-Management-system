const { Router } = require("express");
require('dotenv').config();

const memberRouter = Router();
const { memberModel } = require("../db");
const cloudinary = require('../cloudinaryConfig');
const z = require("zod");
const multer = require('multer');
const fs = require('fs'); 
const upload = multer({ dest: 'uploads/' });

memberRouter.post('/add', upload.single('profileImage'), async function (req, res) {
    const requiredBody = z.object({
        profileImage: z.string().optional(),
        name: z.string().min(2, 'First name must be at least 2 characters').max(20, 'First name must be at most 20 characters'),
        email: z.string().email('Invalid email address').min(3).max(50),
        membershiptype: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
        datejoined: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
        gender: z.enum(['male', 'female'], 'Invalid gender').optional(),
        birthdate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid birthdate format'),
        membershipDate: z.string().refine(val => !isNaN(Date.parse(val))).optional(),
        phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
        address: z.string().min(5, 'Address is too short').max(100, 'Address is too long').optional(),
        pincode: z.string().min(6, 'Pincode must be exactly 6 digits').max(6, 'Pincode must be exactly 6 digits').regex(/^\d+$/, 'Pincode should contain only digits').optional(),
        status: z.string().optional(),
        cloudinaryId: z.string().optional(),
        secretKey: z.string(),
    });

    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.json({
            message: "Incorrect format",
        });
    }

    const {
        name,
        email,
        membershiptype,
        datejoined,
        gender,
        birthdate,
        phoneNumber,
        address,
        pincode,
        status,
        profileImage,
        cloudinaryId,
        secretKey,
        membershipDate
    } = req.body;

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
                folder: 'gym-members',
            });
            profileImageUrl = result.secure_url;
            cloudinaryImageId = result.public_id;

            fs.unlinkSync(req.file.path); 
        }

        try {
            const member = await memberModel.create({
                name,
                email,
                type: membershiptype,
                datejoined: new Date(datejoined),
                gender,
                birthdate: new Date(birthdate),
                phonenumber: phoneNumber,
                address,
                pincode,
                status,
                membershipDate,
                img: profileImageUrl,
                cloudinaryId: cloudinaryImageId
            });
        } catch (e) {
            return res.json({
                message: "Email or Phone number exists"
            })
        }


        return res.status(201).json({
            message: "Member added successfully",
        
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to add member",
            error: error,
        });
    }
});

memberRouter.put('/edit/:id', upload.single('profileImage'), async function (req, res) {
    const requiredBody = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(20, 'Name must be at most 20 characters').optional(),
        email: z.string().email('Invalid email address').min(3).max(50).optional(),
        membershiptype: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
        datejoined: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
        gender: z.enum(['male', 'female'], 'Invalid gender').optional(),
        birthdate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid birthdate format').optional(),
        membershipdate: z.string().refine(val => !isNaN(Date.parse(val))).optional(),
        phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
        address: z.string().min(5, 'Address is too short').max(100, 'Address is too long').optional(),
        pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits').optional(),
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
        name, email, membershiptype, datejoined, gender, birthdate, phonenumber,
        address, pincode, status, profileImage, cloudinaryId, secretKey, membershipdate,
    } = req.body;
    if (secretKey !== process.env.SECRET_KEY) {
        return res.json({
            message: "Invalid secret key"
        });
    }



    try {
        const existingMember = await memberModel.findById(id);

        if (!existingMember) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        let profileImageUrl = profileImage || existingMember.img;
        let cloudinaryImageId = cloudinaryId || existingMember.cloudinaryId;

        if (req.file) {
            if (existingMember.cloudinaryId) {
                await cloudinary.uploader.destroy(existingMember.cloudinaryId);
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'gym-members',
            });
            profileImageUrl = result.secure_url;
            cloudinaryImageId = result.public_id;
        }

        existingMember.set({
            img: profileImageUrl,
            name,
            membershiptype,
            datejoined: datejoined ? new Date(datejoined) : existingMember.datejoined,
            gender,
            birthdate: birthdate ? new Date(birthdate) : existingMember.birthdate,
            address,
            pincode,
            status: status,
            membershipdate: membershipdate ? new Date(membershipdate) : existingMember.membershipdate,
            cloudinaryId: cloudinaryImageId,
        });

        await existingMember.save();

        res.status(200).json({
            message: "Member updated successfully",
            member: existingMember,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update member",
            error: error.response.data.errorResponse,
        });
    }
});

memberRouter.get("/all", async (req, res) => {
    const members = await memberModel.find({});
    res.json({
        members
    })
})

memberRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const member = await memberModel.findById(id); 

        if (!member) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        await memberModel.findByIdAndDelete(id); 

        res.status(200).json({
            message: "Member deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete Member",
            error: error.message,
        });
    }
});

memberRouter.get("/person/:id", async (req, res) => {
    const { id } = req.params;

    const member = await memberModel.findOne({
        _id: id
    })
    res.json({
        member
    })
})
memberRouter.get("/count", async (req, res) => {
    const count = await memberModel.countDocuments({});
    res.json({ count });
})

module.exports = { memberRouter };

