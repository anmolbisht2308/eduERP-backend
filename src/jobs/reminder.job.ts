import { Invoice, InvoiceStatus } from '../modules/invoices/invoice.model';
import * as emailService from '../modules/notifications/email.service';
import { Student } from '../modules/students/student.model';

export const sendDueReminders = async () => {
    console.log('[JOB] Sending Due Fee Reminders...');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find invoices due tomorrow
    const dueSoonInvoices = await Invoice.find({
        status: { $in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIALLY_PAID] },
        dueDate: {
            $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
            $lte: new Date(tomorrow.setHours(23, 59, 59, 999))
        }
    }).populate('studentId');

    for (const invoice of dueSoonInvoices) {
        const student = invoice.studentId as any;
        if (student && student.parentEmail) {
            const subject = `Fee Reminder Due Tomorrow - ${student.firstName}`;
            const message = `
                Dear Parent,
                
                This is a gentle reminder that the fee payment of INR ${invoice.balanceAmount} for ${student.firstName} ${student.lastName} is due tomorrow (${invoice.dueDate.toDateString()}).
                
                Please pay via the portal or visit the school office.
                
                Regards,
                School Administration
            `;

            await emailService.sendEmail(student.parentEmail, subject, message);
            console.log(`Sent reminder to ${student.parentEmail} for Invoice ${invoice.invoiceNumber}`);
        }
    }

    console.log('[JOB] Reminder Job Completed.');
};
