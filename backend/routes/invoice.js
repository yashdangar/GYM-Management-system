const { Router } = require("express");
const { invoiceModel, memberModel, salesModel } = require("../db"); // Assuming invoiceModel is properly defined in db.js
const z = require("zod");

const invoiceRouter = Router();
require('dotenv').config()


invoiceRouter.post('/create', async (req, res) => {
    const requiredBody = z.object({
        customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
        customerEmail: z.string().email('Invalid email address').min(5).max(50),
        membershipType: z.enum(['bronze', 'silver', 'gold', 'platinum']),
        invoiceDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
        totalAmount: z.number().positive('Total amount must be a positive number'),
        paidAmount: z.number().positive('Paid amount must be a positive number'),
        dueAmount: z.number().positive('Due amount must be a positive number'),
    })
    // Validate request body
    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(400).json({
            message: "Incorrect format",
            error: validateBody.error,
        });
    }

    const { customerName, customerEmail, membershipType, invoiceDate, totalAmount, paidAmount, dueAmount } = req.body;
    let membershipDurationInMonths;
    switch (membershipType) {
        case 'bronze':
            membershipDurationInMonths = 1;
            break;
        case 'silver':
            membershipDurationInMonths = 3;
            break;
        case 'gold':
            membershipDurationInMonths = 6;
            break;
        case 'platinum':
            membershipDurationInMonths = 12;
            break;
        default:
            membershipDurationInMonths = 0;
            break;
    }
    const invoiceDateObj = new Date(invoiceDate);
    const membershipEndDate = new Date(invoiceDateObj.setMonth(invoiceDateObj.getMonth() + membershipDurationInMonths));
    console.log(membershipEndDate);
    try {
        // Create the invoice document
        const invoice = await invoiceModel.create({
            customerName,
            customerEmail,
            membershipType,
            invoiceDate: new Date(invoiceDate),
            totalAmount,
            paidAmount,
            dueAmount,
        });
  
        // Update the member document
        const member = await memberModel.findOne({ customerEmail });
        if (member) {
            member.membershipDate = membershipEndDate;
            member.membershipType = membershipType;
            await member.save();
        }

        const sales = await salesModel.findOne(); // Assuming there's only one sales document

        if (sales) {
            // Increment membership count
            switch (membershipType) {
                case 'bronze':
                    sales.membershipCounts.bronze += 1;
                    break;
                case 'silver':
                    sales.membershipCounts.silver += 1;
                    break;
                case 'gold':
                    sales.membershipCounts.gold += 1;
                    break;
                case 'platinum':
                    sales.membershipCounts.platinum += 1;
                    break;
                default:
                    throw new Error("Invalid membership type");
            }

            // Update sales statistics
            sales.totalIncome += totalAmount;
            sales.totalPaidMoney += paidAmount;
            sales.totalUnpaidMoney += dueAmount;

            // Save the updated sales document
            await sales.save();
        } else {
            // If no sales document exists, create one
            await salesModel.create({
                totalIncome: totalAmount,
                membershipCounts: {
                    bronze: membershipType === 'bronze' ? 1 : 0,
                    silver: membershipType === 'silver' ? 1 : 0,
                    gold: membershipType === 'gold' ? 1 : 0,
                    platinum: membershipType === 'platinum' ? 1 : 0,
                },
                totalPaidMoney: paidAmount,
                totalUnpaidMoney: dueAmount,
            });
        }
        res.status(201).json({
            message: "Invoice created successfully",
            invoice,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create invoice",
            error: error.message,
        });
    }
});

module.exports = { invoiceRouter };
