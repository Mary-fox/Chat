import { Request, Response } from 'express';
import ApiError from '../error/ApiError';

export default (error: Error, req: Request, res: Response) => {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка!' });
};