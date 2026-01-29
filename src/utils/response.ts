import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message: string = 'Success', statusCode: number = 200) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};
