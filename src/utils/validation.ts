import Joi from 'joi';

// Common validation schemas
export const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid ObjectId');

export const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
    order: Joi.string().valid('asc', 'desc').default('desc'),
});

// Student validation
export const createStudentSchema = Joi.object({
    classId: objectIdSchema.required(),
    sectionId: objectIdSchema,
    admissionNumber: Joi.string().required(),
    rollNumber: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date(),
    gender: Joi.string().valid('male', 'female', 'other'),
    parentName: Joi.string().required(),
    parentEmail: Joi.string().email(),
    parentPhone: Joi.string().required(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    pincode: Joi.string(),
});

export const updateStudentSchema = Joi.object({
    classId: objectIdSchema,
    sectionId: objectIdSchema,
    rollNumber: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    dateOfBirth: Joi.date(),
    gender: Joi.string().valid('male', 'female', 'other'),
    parentName: Joi.string(),
    parentEmail: Joi.string().email(),
    parentPhone: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    pincode: Joi.string(),
    status: Joi.string().valid('active', 'inactive', 'graduated', 'transferred', 'dropped'),
});

// Fee Structure validation
export const createFeeStructureSchema = Joi.object({
    classId: objectIdSchema.required(),
    name: Joi.string().required(),
    frequency: Joi.string().valid('one_time', 'monthly', 'quarterly', 'half_yearly', 'yearly').required(),
    feeComponents: Joi.array().items(
        Joi.object({
            feeHeadId: objectIdSchema.required(),
            amount: Joi.number().min(0).required(),
        })
    ).required(),
    installments: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            dueDate: Joi.date().required(),
            amount: Joi.number().min(0).required(),
        })
    ),
    allowDiscount: Joi.boolean(),
    lateFeePerDay: Joi.number().min(0),
});

// Invoice validation
export const createInvoiceSchema = Joi.object({
    studentId: objectIdSchema.required(),
    feeStructureId: objectIdSchema,
    dueDate: Joi.date().required(),
    items: Joi.array().items(
        Joi.object({
            feeHeadId: objectIdSchema.required(),
            description: Joi.string().required(),
            amount: Joi.number().min(0).required(),
        })
    ).required(),
    discountAmount: Joi.number().min(0).default(0),
    discountReason: Joi.string(),
    taxPercentage: Joi.number().min(0).max(100).default(0),
    notes: Joi.string(),
});

// Payment validation
export const createPaymentSchema = Joi.object({
    invoiceId: objectIdSchema.required(),
    amount: Joi.number().min(0).required(),
    paymentMethod: Joi.string().valid('cash', 'online', 'cheque', 'bank_transfer').required(),
    chequeNumber: Joi.string(),
    bankName: Joi.string(),
    chequeDate: Joi.date(),
    notes: Joi.string(),
});

// Academic Year validation
export const createAcademicYearSchema = Joi.object({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    isCurrent: Joi.boolean(),
    isActive: Joi.boolean(),
    schoolId: Joi.string().allow('', null), // Allow but ignore
});

// Class validation
export const createClassSchema = Joi.object({
    name: Joi.string().required(),
    displayOrder: Joi.number().integer(),
    sectionName: Joi.string().allow('', null), // Allow optional section creation
});

// Helper function to validate request
export const validate = (schema: Joi.ObjectSchema) => {
    return (req: any, res: any, next: any) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail: any) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors,
            });
        }

        next();
    };
};
