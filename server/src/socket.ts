import socketio from 'socket.io';

import { MessageModel } from './models/Message';

export const startSocketServer = (io: socketio.Server) => {
    io.on('connection', (socket) => {
        const { id } = socket;
        console.log(`New client session: ${id}`);

        // Добавляем свойство sessionUsername к объекту socket
        (socket as any).sessionUsername = '';

        // New login
        socket.on('new login', (user: any) => {
            console.log(`User connected: ${user.username}`);
            // Добавление нового пользователя в список всех пользователей

            // Присвоение значения sessionUsername при новом входе пользователя
            (socket as any).sessionUsername = user.username;

            // Отправка системного сообщения о входе нового пользователя
            io.emit('system message', { content: `${user.username} joined the chat`, author: 'Admin' });
        });
        
        socket.on('join room', (room: string, username:string) => {
            socket.join(room);
            console.log(`User  ${username} joined room ${room}`);
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${(socket as any).sessionUsername} left the chat`);
            // Отправка системного сообщения о выходе пользователя
            io.emit('system message', { content: `${(socket as any).sessionUsername} left the chat`, author: 'Admin' });
        });
        
        // Send Message
        socket.on('send message', async (data: any) => {
            const { author, content, room } = data; 
            try {
                const newMessage = await MessageModel.create({
                    author: data.author,
                    content: data.content,
                    room: data.room,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                io.to(room).emit('message received', newMessage); // Отправляем сообщение всем участникам комнаты

                console.log('Message saved in the database:', newMessage);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });
    });
};
