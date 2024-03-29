import express, { Router, Request, Response } from 'express';
import { sequelize } from './config/database';
import { MessageModel } from './models/Message';

import { Express } from 'express';
import { getAllMessages } from './controllers/messageController';
const router = Router();

   router.get("/messages", getAllMessages);




export default router;