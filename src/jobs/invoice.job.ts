import { School } from '../modules/schools/school.model';
import { FeeStructure } from '../modules/fees/fee-structure.model';
import { generateInvoicesForClass } from '../modules/invoices/invoice-generator';
import { AcademicYear } from '../modules/academic/academic-year.model';

export const generateDueInvoices = async () => {
    console.log('[JOB] Starting Auto-Invoice Generation...');

    // 1. Find active schools
    const schools = await School.find({ isActive: true });

    for (const school of schools) {
        // 2. Find current academic year
        const currentYear = await AcademicYear.findOne({ schoolId: school._id, isCurrent: true });
        if (!currentYear) continue;

        // 3. Find active fee structures
        const feeStructures = await FeeStructure.find({
            schoolId: school._id,
            academicYearId: currentYear._id,
            isActive: true
        });

        // 4. Check installments due in next X days (e.g., 7 days)
        // Or generate on the 1st of month for the month's due installments
        const today = new Date();
        const lookahead = new Date();
        lookahead.setDate(today.getDate() + 15); // Generate 15 days in advance

        for (const structure of feeStructures) {
            // Find installments due between today and lookahead
            // And not already generated (handled by generator logic check)

            const dueInstallments = structure.installments.filter(inst => {
                const dueDate = new Date(inst.dueDate);
                return dueDate >= today && dueDate <= lookahead;
            });

            for (const installment of dueInstallments) {
                console.log(`Generating invoices for School: ${school.name}, Class: ${structure.classId}, Installment: ${installment.name}`);

                try {
                    const result = await generateInvoicesForClass(
                        school._id.toString(),
                        structure.classId.toString(),
                        structure._id.toString(),
                        currentYear._id.toString(),
                        installment.name,
                        'SYSTEM_CRON'
                    );

                    console.log(`   -> Created: ${result.created}, Errors: ${result.errors}`);
                } catch (err) {
                    console.error(`   -> Failed: ${err}`);
                }
            }
        }
    }
    console.log('[JOB] Auto-Invoice Generation Completed.');
};
