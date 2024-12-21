const { Router } = require("express");
const { attendanceModel } = require("../db");
const z = require("zod");

const attendanceRouter = Router();

attendanceRouter.post('/add', async (req, res) => {
    const requiredBody = z.object({
        date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
        presentCount: z.number().min(0, 'Present count cannot be negative'),
    });

    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(400).json({
            message: "Validation failed",
            error: validateBody.error,
        });
    }

    const { date, presentCount } = req.body;
    const attendanceDate = new Date(date);

    try {
        const attendance = await attendanceModel.findOneAndUpdate(
            { date: attendanceDate },
            { $set: { presentCount } },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: "Attendance recorded successfully",
            attendance,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to record attendance",
            error: error.message,
        });
    }
});

attendanceRouter.get('/last7days', async (req, res) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    try {
        const attendanceRecords = await attendanceModel.find({
            date: { $gte: sevenDaysAgo, $lte: today },
        }).sort({ date: 1 }); 

        res.status(200).json({
            message: "Attendance records for the last 7 days",
            records: attendanceRecords,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch attendance",
            error: error.message,
        });
    }
});

module.exports = { attendanceRouter };
