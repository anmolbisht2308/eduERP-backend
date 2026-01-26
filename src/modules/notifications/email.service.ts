import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../../config/notification';
import { AppError } from '../../utils/AppError';

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

export const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
    try {
        const info = await transporter.sendMail({
            from: EMAIL_CONFIG.from,
            to,
            subject,
            text: text || html.replace(/<[^>]*>?/gm, ''), // Fallback plain text
            html,
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw always, maybe just log, depending on criticality
        // For now, logging error but not breaking flow if notification fails often
        return null;
    }
};

export const sendInvoiceEmail = async (to: string, studentName: string, invoiceLink: string) => {
    const subject = 'New Invoice Generated';
    const html = `
        <h3>Hello ${studentName},</h3>
        <p>A new fees invoice has been generated for you.</p>
        <p>Please view and pay by clicking the link below:</p>
        <a href="${invoiceLink}">View Invoice</a>
        <br>
        <p>Thank you.</p>
    `;
    return await sendEmail(to, subject, html);
};

export const sendReceiptEmail = async (to: string, studentName: string, amount: number, transactionId: string) => {
    const subject = 'Payment Receipt';
    const html = `
        <h3>Hello ${studentName},</h3>
        <p>We have received a payment of <strong>INR ${amount}</strong>.</p>
        <p>Transaction ID: ${transactionId}</p>
        <p>Thank you for your payment.</p>
    `;
    return await sendEmail(to, subject, html);
};
