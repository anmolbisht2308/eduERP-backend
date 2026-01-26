import { Invoice, InvoiceStatus } from '../modules/invoices/invoice.model';
import { FeeStructure } from '../modules/fees/fee-structure.model';

export const applyLateFees = async () => {
    console.log('[JOB] Starting Late Fee Application...');

    const today = new Date();

    // Find overdue invoices that are pending or partially paid
    // AND haven't been cancelled
    const overdueInvoices = await Invoice.find({
        status: { $in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIALLY_PAID] },
        dueDate: { $lt: today }
    }).populate('feeStructureId');

    for (const invoice of overdueInvoices) {
        const feeStructure = invoice.feeStructureId as any;

        if (feeStructure && feeStructure.lateFeePerDay > 0) {
            // Calculate days overdue
            const diffTime = Math.abs(today.getTime() - new Date(invoice.dueDate).getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Simple Late Fee Logic: LateFee = Days * Rate
            // Or Fixed Late Fee? Assuming Daily rate from model

            const newLateFee = diffDays * feeStructure.lateFeePerDay;

            // Only update if increased (idempotency check roughly)
            if (newLateFee > invoice.lateFee) {
                const increment = newLateFee - invoice.lateFee;

                invoice.lateFee = newLateFee;
                invoice.totalAmount += increment;
                invoice.balanceAmount += increment;
                invoice.status = InvoiceStatus.OVERDUE;

                await invoice.save();
                console.log(`Applied late fee of ${increment} to Invoice ${invoice.invoiceNumber}`);
            } else if (invoice.status !== InvoiceStatus.OVERDUE) {
                invoice.status = InvoiceStatus.OVERDUE;
                await invoice.save();
            }
        }
    }

    console.log('[JOB] Late Fee Application Completed.');
};
