const { Router } = require("express");
const { invoiceModel, memberModel, salesModel } = require("../db");
const z = require("zod");

const invoiceRouter = Router();
require('dotenv').config()


invoiceRouter.post('/create', async (req, res) => {
    const requiredBody = z.object({
        customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
        customerEmail: z.string().email('Invalid email address').min(5).max(50),
        membershipType: z.enum(['bronze', 'silver', 'gold', 'platinum']),
        invoicedate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
        totalAmount: z.number().positive('Total amount must be a positive number'),
        paidAmount: z.number().positive('Paid amount must be a positive number'),
        dueAmount: z.number().nonnegative('Due amount must be a positive number'),
        secretKey: z.string(),
    })

    const validateBody = requiredBody.safeParse(req.body);

    if (!validateBody.success) {
        return res.status(400).json({
            message: "Incorrect format",
            error: validateBody.error,
        });
    }


    const { customerName, customerEmail, membershipType, invoicedate, totalAmount, paidAmount, secretKey, dueAmount } = req.body;
    if (secretKey !== process.env.SECRET_KEY) {
        return res.json({
            message: "Invalid secret key"
        });
    }
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
    const invoiceDateObj = new Date(invoicedate);
    const membershipEndDate = new Date(invoiceDateObj.setMonth(invoiceDateObj.getMonth() + membershipDurationInMonths));

    try {
        const member = await memberModel.findOne({ email: customerEmail });
        if (member) {
            const updatedMember = await memberModel.updateOne(
                { _id: member._id },
                {
                    $set: {
                        membershipdate: membershipEndDate,
                        membershiptype: membershipType,
                    }
                }
            );
        } else {
            return res.json({
                message: "Member not found"
            })
        }
        const invoice = await invoiceModel.create({
            name: customerName,
            email: customerEmail,
            membershiptype: membershipType,
            invoicedate: new Date(invoicedate),
            totalamount: totalAmount,
            paidamount: paidAmount,
            dueamount: dueAmount,
        });




        const sales = await salesModel.findOne();

        if (sales) {
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

            sales.totalIncome += totalAmount;
            sales.totalPaidMoney += paidAmount;
            sales.totalUnpaidMoney += dueAmount;

            await sales.save();
        } else {
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
invoiceRouter.put('/edit/:id', async (req, res) => {
    const requiredBody = z.object({
        customerName: z.string().min(2, 'Customer name must be at least 2 characters').optional(),
        customerEmail: z.string().email('Invalid email address').min(5).max(50).optional(),
        membershipType: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
        invoicedate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
        totalAmount: z.number().positive('Total amount must be a positive number').optional(),
        paidAmount: z.number().positive('Paid amount must be a positive number').optional(),
        dueAmount: z.number().positive('Due amount must be a positive number').optional(),
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
    const { customerName, customerEmail, secretKey, membershipType, invoicedate, totalAmount, paidAmount, dueAmount } = req.body;

    if (secretKey !== process.env.SECRET_KEY) {
        return res.json({
            message: "Invalid secret key"
        });
    }
    try {
        const invoice = await invoiceModel.findById(id);
        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found",
            });
        }

        const originalInvoice = { ...invoice.toObject() };

        if (customerName) invoice.name = customerName;
        if (customerEmail) invoice.email = customerEmail;
        if (membershipType) invoice.membershiptype = membershipType;
        if (invoicedate) invoice.invoicedate = new Date(invoicedate);
        if (totalAmount) invoice.totalamount = totalAmount;
        if (paidAmount) invoice.paidamount = paidAmount;
        if (dueAmount) invoice.dueamount = dueAmount;

        await invoice.save();

        const sales = await salesModel.findOne();
        if (!sales) {
            throw new Error("Sales document not found");
        }

        switch (originalInvoice.membershiptype) {
            case 'bronze':
                sales.membershipCounts.bronze -= 1;
                break;
            case 'silver':
                sales.membershipCounts.silver -= 1;
                break;
            case 'gold':
                sales.membershipCounts.gold -= 1;
                break;
            case 'platinum':
                sales.membershipCounts.platinum -= 1;
                break;
            default:
                throw new Error("Invalid original membership type");
        }
        sales.totalIncome -= originalInvoice.totalamount;
        sales.totalPaidMoney -= originalInvoice.paidamount;
        sales.totalUnpaidMoney -= originalInvoice.dueamount;

        switch (invoice.membershiptype) {
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
                throw new Error("Invalid updated membership type");
        }
        sales.totalIncome += invoice.totalamount;
        sales.totalPaidMoney += invoice.paidamount;
        sales.totalUnpaidMoney += invoice.dueamount;

        await sales.save();

        if (membershipType || invoicedate) {
            let membershipDurationInMonths = 0;
            switch (membershipType || invoice.membershiptype) {
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
            }

            const membershipEndDate = invoicedate
                ? new Date(new Date(invoicedate).setMonth(new Date(invoicedate).getMonth() + membershipDurationInMonths))
                : invoice.invoicedate;

            const member = await memberModel.findOne({ email: customerEmail || invoice.email });
            if (member) {
                member.membershiptype = membershipType || invoice.membershiptype;
                member.membershipdate = membershipEndDate;
                await member.save();
            }
        }

        res.status(200).json({
            message: "Invoice updated successfully",
            invoice,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update invoice",
            error: error.message,
        });
    }
});


invoiceRouter.get("/all", async (req, res) => {
    const invoice = await invoiceModel.find();

    res.json({
        invoice
    })

})
invoiceRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const invoice = await invoiceModel.findById(id);

        if (!invoice) {
            return res.status(404).json({
                message: "invoice not found",
            });
        }
        const sales = await salesModel.findOne();

        switch (invoice.membershiptype) {
            case 'bronze':
                sales.membershipCounts.bronze -= 1;
                break;
            case 'silver':
                sales.membershipCounts.silver -= 1;
                break;
            case 'gold':
                sales.membershipCounts.gold -= 1;
                break;
            case 'platinum':
                sales.membershipCounts.platinum -= 1;
                break;
            default:
                throw new Error("Invalid membership type");
        }

        sales.totalIncome -= invoice.totalamount;
        sales.totalPaidMoney -= invoice.paidamount;
        sales.totalUnpaidMoney -= invoice.dueamount;

        await sales.save();

        await invoiceModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "invoice deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete invoice",
            error: error.message,
        });
    }
});
module.exports = { invoiceRouter };
