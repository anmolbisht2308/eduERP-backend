import { Invoice, IInvoice, InvoiceStatus } from './invoice.model';
import { Student } from '../students/student.model';
import { FeeStructure, IInstallment } from '../fees/fee-structure.model';
import mongoose from 'mongoose';

interface InvoiceGenerationResult {
    created: number;
    errors: number;
    details: any[];
}

export const generateInvoicesForClass = async (
    schoolId: string,
    classId: string,
    feeStructureId: string,
    academicYearId: string,
    installmentName?: string, // If specific installment provided, generate only that
    createdBy?: string
): Promise<InvoiceGenerationResult> => {

    // 1. Get Fee Structure
    const feeStructure = await FeeStructure.findOne({ _id: feeStructureId, schoolId });
    if (!feeStructure) throw new Error('Fee structure not found');

    // 2. Get Students in Class
    const students = await Student.find({ schoolId, classId, status: 'active' });

    const result: InvoiceGenerationResult = { created: 0, errors: 0, details: [] };

    // 3. Determine installments to generate
    // If InstallmentName is provided, filter. Else generate all (or typically next due)
    // For now, let's assume we generating specific installment or all depending on logic.
    // Simplifying: If no installmentName, generate ALL defined installments (useful for start of year)

    const installmentsToProcess = installmentName
        ? feeStructure.installments.filter(i => i.name === installmentName)
        : feeStructure.installments;

    if (installmentsToProcess.length === 0) {
        throw new Error('No valid installments found to generate');
    }

    // 4. Generate Invoices
    for (const student of students) {
        for (const installment of installmentsToProcess) {
            try {
                // Check if invoice already exists for this student + installment
                const existing = await Invoice.findOne({
                    schoolId,
                    studentId: student._id,
                    feeStructureId,
                    // We need a way to identify installment uniqueness. 
                    // Usually we might store installment name in metadata or check due date matches
                    // For now, using invoice date or notes. 
                    // Ideally, Invoice model should have 'installmentName' field.
                    // Storing in notes for MVP: "Installment: Q1"
                    notes: { $regex: `Installment: ${installment.name}` }
                });

                if (existing) {
                    result.details.push({ student: student.admissionNumber, message: 'Already exists', installment: installment.name });
                    continue;
                }

                // Create Invoice Items from Fee Components based on ratio
                // Usually fee components are distributed across installments or fully per installment?
                // Logic: A simple model is each installment is a % of total.
                // Or fee structure defines components. 
                // For simplicity here: We assume the installment amount is the total invoice amount.
                // We map this amount to a single "Tuition/Installment Fee" item or 
                // proportionally split valid components.

                // Simplified Generation:
                const invoiceAmount = installment.amount;

                // Map components proportionally if needed, or just create one generic item
                // Better: Create items matching fee heads, scaled to installment amount
                const totalFeeStructureAmount = feeStructure.totalAmount;
                const items = feeStructure.feeComponents.map(comp => ({
                    feeHeadId: comp.feeHeadId,
                    description: 'Fee Charge', // Will fetch name in real app or pre-populate
                    amount: (comp.amount / totalFeeStructureAmount) * invoiceAmount
                }));

                const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                await Invoice.create({
                    schoolId,
                    academicYearId,
                    studentId: student._id,
                    feeStructureId,
                    invoiceNumber,
                    dueDate: installment.dueDate,
                    items,
                    subtotal: invoiceAmount,
                    totalAmount: invoiceAmount,
                    balanceAmount: invoiceAmount,
                    status: InvoiceStatus.PENDING,
                    notes: `Installment: ${installment.name}`,
                    createdBy: createdBy || student._id // Fallback
                });

                result.created++;
            } catch (err: any) {
                result.errors++;
                result.details.push({ student: student.admissionNumber, error: err.message });
            }
        }
    }

    return result;
};
