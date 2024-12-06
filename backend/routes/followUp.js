const { Router } = require("express");
const { followUpModel } = require("../db"); // Assuming followUpModel is properly defined in db.js
const z = require("zod");
const mongoose = require("mongoose");

const followUpRouter = Router();

followUpRouter.post('/create', async (req, res) => {
    // Define the validation schema
    const requiredBody = z.object({
        followUpType: z.enum(["Enquiry", "Fee Due", "Trial"]),
        followupDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid follow-up date format'),
        followUpTime: z.string().regex(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, 'Invalid time format, use HH:mm'),
        nextAppointmentDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid appointment date format'),
        notes: z.string().optional(),
        memberEmail:z.email(),
        status: z.boolean().optional(),
    });

    // Validate request body
    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(400).json({
            message: "Validation failed",
            error: validateBody.error,
        });
    }

    const { followUpType, followupDate, followUpTime, nextAppointmentDate, notes, memberId, trainerId, status } = req.body;

    try {
        // Create the follow-up document
        const followUp = await followUpModel.create({
            followUpType,
            followupDate: new Date(followupDate),
            followUpTime,
            nextAppointmentDate: new Date(nextAppointmentDate),
            notes,
            memberId: memberId ? new mongoose.Types.ObjectId(memberId) : null,
            trainerId: trainerId ? new mongoose.Types.ObjectId(trainerId) : null,
            status,
        });

        res.status(201).json({
            message: "Follow-up created successfully",
            followUp,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create follow-up",
            error: error.message,
        });
    }
});

module.exports = { followUpRouter };
