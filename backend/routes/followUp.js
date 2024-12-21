const { Router } = require("express");
const { followUpModel, memberModel } = require("../db"); 
const z = require("zod");
const mongoose = require("mongoose");

const followUpRouter = Router();

followUpRouter.post('/create', async (req, res) => {
    const requiredBody = z.object({
        name:z.string(),
        email: z.string().email(),
        type: z.enum(["Enquiry", "Fee Due", "Trial"]),
        date: z.string(),
        notes: z.string().optional(),
        status: z.boolean().optional(),
    });
    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(400).json({
            message: "Validation failed",
            error: validateBody.error,
        });
    }

    const { type, date, time, notes, email, status, followUpId } = req.body;

    try {
        const member = await memberModel.findOne({ email: email });
        if (!member) {
            return res.status(404).json({
                message: "Member does not exist",
            });
        }

        const { profileImage, firstName, lastName } = member;

        if (followUpId) {
            const existingFollowUp = await followUpModel.findById(followUpId);
            if (!existingFollowUp) {
                return res.status(404).json({
                    message: "Follow-up not found",
                });
            }

            existingFollowUp.type = type;
            existingFollowUp.date = new Date(date);
            existingFollowUp.time = time;
            existingFollowUp.notes = notes || existingFollowUp.notes; 
            existingFollowUp.status = status !== undefined ? status : existingFollowUp.status; 

            const updatedFollowUp = await existingFollowUp.save();

            return res.status(200).json({
                message: "Follow-up updated successfully",
                followUp: updatedFollowUp,
            });
        } else {
            const followUp = await followUpModel.create({
                img: profileImage,
                name: `${firstName} ${lastName}`,
                email,
                type,
                date: new Date(date),
                time,
                notes,
                status,
            });

            return res.status(201).json({
                message: "Follow-up created successfully",
                followUp,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to create or update follow-up",
            error: error.message,
        });
    }
});

followUpRouter.get('/all', async (req, res) => {

      const followUps = await followUpModel.find()
      res.json({
        followUps,
      })
  });
  

followUpRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const followUp = await followUpModel.findById(id); 

        if (!followUp) {
            return res.status(404).json({
                message: "Follow-up not found",
            });
        }

        await followUpModel.findByIdAndDelete(id); 

        res.status(200).json({
            message: "Follow-up deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete follow-up",
            error: error.message,
        });
    }
});

module.exports = { followUpRouter };
