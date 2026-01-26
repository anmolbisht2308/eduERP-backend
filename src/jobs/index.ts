import cron from 'node-cron';
import { generateDueInvoices } from './invoice.job';
import { applyLateFees } from './late-fee.job';
import { sendDueReminders } from './reminder.job';

export const initJobs = () => {
    console.log('Initializing Background Jobs...');

    // Run Auto-Invoice Generation - Daily at 1:00 AM
    cron.schedule('0 1 * * *', () => {
        generateDueInvoices().catch(err => console.error(err));
    });

    // Run Late Fee Application - Daily at 2:00 AM
    cron.schedule('0 2 * * *', () => {
        applyLateFees().catch(err => console.error(err));
    });

    // Run Due Reminders - Daily at 9:00 AM
    cron.schedule('0 9 * * *', () => {
        sendDueReminders().catch(err => console.error(err));
    });

    console.log('Background Jobs Scheduled.');
};
