import express, { Express } from 'express';
import http from 'http';
import socketio from 'socket.io';
import cors from 'cors';
import { startRoutes } from './routes';
import { startSocketServer } from './socket';
import { sequelize } from './config/database';



export const startServer = async () => {
    const app: Express = express();
    const PORT = process.env.PORT || 8001;

    app.use(cors());
    app.use(express.json());

    const server = http.createServer(app);
    const io = new socketio.Server(server, {
        cors: {
            origin: 'http://localhost:3001',
            credentials: true,
        },
        path: '/socket.io',
    });

    startRoutes(app);
    startSocketServer(io);

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to synchronize models with the database:", error);
    }
};

startServer();