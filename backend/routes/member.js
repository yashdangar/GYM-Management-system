const { Router } = require("express");
require('dotenv').config();

const memberRouter = Router();
const { memberModel } = require("../db");
const cloudinary = require('../cloudinaryConfig');
const z = require("zod");
const multer = require('multer');
const sharp = require('sharp'); // Import Sharp
const path = require('path');
const fs = require('fs'); // File system module for cleanup

const upload = multer({ dest: 'uploads/' });

memberRouter.post('/add', upload.single('profileImage'), async function (req, res) {
    const requiredBody = z.object({
        profileImage: z.string().optional(),
        name: z.string().min(2, 'First name must be at least 2 characters').max(20, 'First name must be at most 20 characters'),
        email: z.string().email('Invalid email address').min(3).max(50),
        membershiptype: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
        dateJoined: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
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

    // Validate request body
    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(404).json({
            message: "Incorrect format",
            error: validateBody.error,
        });
    }

    const {
        name,
        email,
        membershiptype,
        dateJoined,
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

        // Process profile image if it exists
        if (req.file) {
            const compressedFilePath = path.join(__dirname, `../uploads/compressed-${Date.now()}.jpeg`);

            // Resize and compress image with Sharp
            await sharp(req.file.path)
                .resize({ width: 500 }) // Resize width (adjust as needed)
                .jpeg({ quality: 80 }) // Adjust quality for compression
                .toFile(compressedFilePath); // Save compressed image

            // Upload the compressed image to Cloudinary
            const result = await cloudinary.uploader.upload(compressedFilePath, {
                folder: 'gym-members',
            });
            profileImageUrl = result.secure_url;
            cloudinaryImageId = result.public_id;

            // Cleanup temporary files
            fs.unlinkSync(req.file.path); // Remove original uploaded file
            fs.unlinkSync(compressedFilePath); // Remove compressed file
        }

        // Create the member document
        const member = await memberModel.create({
            name,
            email,
            type: membershiptype,
            dateJoined: new Date(dateJoined),
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

        res.status(201).json({
            message: "Member added successfully",
            member,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add member",
            error,
        });
    }
});

memberRouter.put('/edit/:id', upload.single('profileImage'), async function (req, res) {
    const requiredBody = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(20, 'Name must be at most 20 characters').optional(),
        email: z.string().email('Invalid email address').min(3).max(50).optional(),
        membershiptype: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
        dateJoined: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
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
        name, email, membershiptype, dateJoined, gender, birthdate, phonenumber,
        address, pincode, status, profileImage, cloudinaryId, secretKey, membershipdate,
    } = req.body;

    if (secretKey !== process.env.SECRET_KEY) {
        return res.status(401).json({
            message: "Unauthorized access",
            error: "Invalid secret key",
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
            // Delete old image if exists
            if (existingMember.cloudinaryId) {
                await cloudinary.uploader.destroy(existingMember.cloudinaryId);
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'gym-members',
            });
            profileImageUrl = result.secure_url;
            cloudinaryImageId = result.public_id;
        }
       
        // Update member details
        existingMember.set({
            img: profileImageUrl,
            name,
            membershiptype,
            dateJoined: dateJoined ? new Date(dateJoined) : existingMember.dateJoined,
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
            error: error.message,
        });
    }
});

 memberRouter.get("/all",async (req,res)=>{
    const members = await memberModel.find({});
    res.json({
        members
    })  
 })

 memberRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // Extract ID from the URL

    try {
        const member = await memberModel.findById(id); // Find 

        if (!member) {
            return res.status(404).json({
                message: "Member not found",
            });
        }

        await memberModel.findByIdAndDelete(id); // Delete 

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

memberRouter.get("/person",async (req, res) => {
    const { id } = req.body;

    const member = await memberModel.findOne({
        _id : id
    })
    res.json({
        member
    })
})
memberRouter.get("/count",async (req,res)=>{
    const count = await memberModel.countDocuments({});
    res.json({count});
})

module.exports = {memberRouter};

