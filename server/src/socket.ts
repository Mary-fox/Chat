import socketio from 'socket.io';
import { getUniqueUsersOnlineByUsername } from './utilities';
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
            // Можно реализовать эту логику по вашим требованиям

            // Присвоение значения sessionUsername при новом входе пользователя
            (socket as any).sessionUsername = user.username;
        });

// Send Message
socket.on('send message', async (message: any) => {
    console.log(`Message: ${message.author}: ${message.content}`);

    try {
        // Сохранение сообщения в базе данных
        const newMessage = await MessageModel.create({
            author: message.author,
            content: message.content,
            createdAt: new Date(),
            updatedAt: new Date() 
        });

        // Отправка сообщения всем подключенным клиентам, включая отправителя
        io.emit('message received', newMessage);

        console.log('Message saved in the database:', newMessage);
    } catch (error) {
        console.error('Error saving message:', error);
    }
});

        // User Typing...
        socket.on('typing...', (username: string) => {
            console.log(`User Typing...: ${username}`);
            // Можно обрабатывать логику уведомлений о наборе здесь
        });

        // User Stopped Typing...
        socket.on('stopped typing...', (username: string) => {
            console.log(`User Stopped Typing...: ${username}`);
            // Можно обрабатывать логику уведомлений о завершении набора здесь
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${(socket as any).sessionUsername}`);
            // Можно обрабатывать логику отключения здесь
        });
    });
};
