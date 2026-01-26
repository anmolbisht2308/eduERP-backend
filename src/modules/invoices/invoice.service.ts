import { Invoice, InvoiceStatus } from './invoice.model';
import { generateInvoicesForClass } from './invoice-generator';
import { AppError } from '../../utils/AppError';

export const createManualInvoice = async (schoolId: string, data: any, userId: string) => {
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return await Invoice.create({
        ...data,
        schoolId,
        invoiceNumber,
        createdBy: userId,
        balanceAmount: data.totalAmount // Initial balance = total
    });
};

export const getInvoices = async (schoolId: string, query: any) => {
    const { page = 1, limit = 10, studentId, status, startDate, endDate } = query;
    const filter: any = { schoolId };

    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;
    if (startDate && endDate) {
        filter.invoiceDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const invoices = await Invoice.find(filter)
        .populate('studentId', 'firstName lastName admissionNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string));

    const total = await Invoice.countDocuments(filter);

    return {
        invoices,
        total,
        page: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
    };
};

export const getInvoice = async (id: string, schoolId: string) => {
    const invoice = await Invoice.findOne({ _id: id, schoolId })
        .populate('studentId', 'firstName lastName admissionNumber parentName parentEmail address')
        .populate('items.feeHeadId', 'name');

    if (!invoice) throw new AppError('Invoice not found', 404);
    return invoice;
};

export const cancelInvoice = async (id: string, schoolId: string, reason: string) => {
    const invoice = await Invoice.findOne({ _id: id, schoolId });
    if (!invoice) throw new AppError('Invoice not found', 404);

    if (invoice.status === InvoiceStatus.PAID || invoice.paidAmount > 0) {
        throw new AppError('Cannot cancel invoice with payments', 400);
    }

    invoice.status = InvoiceStatus.CANCELLED;
    invoice.cancellationReason = reason;
    invoice.cancelledAt = new Date();
    await invoice.save();

    return invoice;
};

export const bulkGenerate = async (schoolId: string, data: any, userId: string) => {
    const { classId, feeStructureId, academicYearId, installmentName } = data;
    return await generateInvoicesForClass(schoolId, classId, feeStructureId, academicYearId, installmentName, userId);
};
