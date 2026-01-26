export const sendSuccess = (res: any, data: any, message: string = 'Success', statusCode: number = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (res: any, message: string, statusCode: number = 400, errors?: any) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};
