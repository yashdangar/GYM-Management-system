const { Router } = require("express");
const { followUpModel, memberModel } = require("../db"); 
const z = require("zod");
const mongoose = require("mongoose");

const followUpRouter = Router();

followUpRouter.post('/create', async (req, res) => {
    // Define the validation schema
    const requiredBody = z.object({
        name:z.string(),
        email: z.string().email(),
        type: z.enum(["Enquiry", "Fee Due", "Trial"]),
        date: z.string(),
        notes: z.string().optional(),
        status: z.boolean().optional(),// Optional field to edit an existing follow-up
    });

    // Validate request body
    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(400).json({
            message: "Validation failed",
            error: validateBody.error,
        });
    }

    const { type, date, time, notes, email, status, followUpId } = req.body;

    try {
        // Check if member exists
        const member = await memberModel.findOne({ email: email });
        if (!member) {
            return res.status(404).json({
                message: "Member does not exist",
            });
        }

        const { profileImage, firstName, lastName } = member;

        // If followUpId exists, update the existing follow-up
        if (followUpId) {
            const existingFollowUp = await followUpModel.findById(followUpId);
            if (!existingFollowUp) {
                return res.status(404).json({
                    message: "Follow-up not found",
                });
            }

            // Update the follow-up document
            existingFollowUp.type = type;
            existingFollowUp.date = new Date(date);
            existingFollowUp.time = time;
            existingFollowUp.notes = notes || existingFollowUp.notes; // Update notes only if provided
            existingFollowUp.status = status !== undefined ? status : existingFollowUp.status; // Only update status if it's provided

            const updatedFollowUp = await existingFollowUp.save();

            return res.status(200).json({
                message: "Follow-up updated successfully",
                followUp: updatedFollowUp,
            });
        } else {
            // Create a new follow-up document
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

// Route to get all follow-ups
followUpRouter.get('/all', async (req, res) => {
    try {
      // Get page and limit from query params
      const page = parseInt(req.query.page) || 1;
      const limit = 7; // Max records per page
  
      // Skip (page - 1) * limit to get the records for the current page
      const skip = (page - 1) * limit;
  
      // Count total follow-ups
      const totalFollowups = await followUpModel.countDocuments();
  
      // Get the paginated follow-ups
      const followUps = await followUpModel.find()
        .skip(skip)
        .limit(limit);
  
      res.json({
        followUps,
        totalPages: Math.ceil(totalFollowups / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve follow-ups", error: error.message });
    }
  });
  

// Route to delete a follow-up by ID
followUpRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // Extract ID from the URL

    try {
        const followUp = await followUpModel.findById(id); // Find the follow-up by ID

        if (!followUp) {
            return res.status(404).json({
                message: "Follow-up not found",
            });
        }

        await followUpModel.findByIdAndDelete(id); // Delete the follow-up

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
