import { Payment, PaymentStatus } from '../payments/payment.model';
import { Invoice, InvoiceStatus } from '../invoices/invoice.model';
import mongoose from 'mongoose';

export const getDailyCollection = async (schoolId: string, date: Date) => {
    // Start and End of the given date
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const match = {
        schoolId: new mongoose.Types.ObjectId(schoolId),
        paymentDate: { $gte: start, $lte: end },
        status: PaymentStatus.SUCCESS
    };

    const aggregation = await Payment.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$paymentMethod',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);

    const total = aggregation.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return { date, breakdown: aggregation, total };
};

export const getMonthlyCollection = async (schoolId: string, month: number, year: number) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const match = {
        schoolId: new mongoose.Types.ObjectId(schoolId),
        paymentDate: { $gte: start, $lte: end },
        status: PaymentStatus.SUCCESS
    };

    const aggregation = await Payment.aggregate([
        { $match: match },
        {
            $group: {
                _id: { day: { $dayOfMonth: '$paymentDate' } },
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.day': 1 } }
    ]);

    const total = aggregation.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return { month, year, breakdown: aggregation, total };
};

export const getOutstandingDues = async (schoolId: string, classId?: string) => {
    const match: any = {
        schoolId: new mongoose.Types.ObjectId(schoolId),
        status: { $in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] },
        balanceAmount: { $gt: 0 }
    };

    // If filtering by class, we need to lookup student -> classId
    // Standard approach: Find students in class first, then invoices
    // OR use $lookup in aggregate

    // Simplification: Invoices don't directly store classId (only studentId and academicYearId),
    // but often it's useful to denormalize classId to Invoice for reporting.
    // For now assuming we filter post-fetch or use simple aggregate if no classId used.

    // If strict class filtering needed without denormalization:
    if (classId) {
        // Find students
        const studentIds = (await mongoose.model('Student').find({
            schoolId,
            classId
        }).select('_id')).map(s => s._id);

        match.studentId = { $in: studentIds };
    }

    const invoices = await Invoice.find(match)
        .populate('studentId', 'firstName lastName admissionNumber parentPhone')
        .sort({ dueDate: 1 });

    const totalOutstanding = invoices.reduce((acc, curr) => acc + curr.balanceAmount, 0);

    return { count: invoices.length, totalOutstanding, invoices };
};
