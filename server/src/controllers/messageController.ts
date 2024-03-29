import { Request, Response, NextFunction } from 'express';

import ApiError from '../error/ApiError';
import { MessageModel } from '../models/Message';

export const getAllMessages= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomNumber = req.query.room as string;
    const messages = await MessageModel.findAll({ where: { room: roomNumber } });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return next(ApiError.internal("Internal Server Error"));
  }
};




