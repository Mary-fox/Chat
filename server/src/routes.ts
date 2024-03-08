import express, { Router, Request, Response } from 'express';
import { sequelize } from './config/database';
import { MessageModel } from './models/Message';

import { Express } from 'express';

export const startRoutes = (app: Express) => {
    app.get('/api/messages', async (request, response) => {
        try {
            const roomNumber = request.query.room as string;
            const messages = await MessageModel.findAll({ where: { room: roomNumber } });
            response.send({ messages });
        } catch (error) {
            console.error('Error fetching messages:', error);
            response.status(500).send('Internal Server Error');
        }
    });


};