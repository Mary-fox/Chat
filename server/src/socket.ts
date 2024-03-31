import socketio, { Socket } from 'socket.io';
import { MessageModel } from './models/Message';
import { MessageData, RoomData } from 'types'; // Предположим, что есть интерфейс UserData в вашем файле с типами.

export const startSocketServer = (io: socketio.Server) => {
    io.on('connection', (socket: Socket) => {
        const { id } = socket;
        console.log(`New client session: ${id}`);

        // Добавляем свойство sessionUsername к объекту socket
        let sessionUsername: string = '';

        // New login
        socket.on('new login', (username: string) => {
            console.log(`User connected: ${username}`);
            // Присвоение значения sessionUsername при новом входе пользователя
            sessionUsername = username;

            // Отправка системного сообщения о входе нового пользователя
            io.emit('system message', { content: `${username} joined the chat`, author: 'Admin' });
        });
        
        socket.on('join room', ({ room, username }: RoomData) => {
            socket.join(room);
            console.log(`User ${username} joined room ${room}`);
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${sessionUsername} left the chat`);
            // Отправка системного сообщения о выходе пользователя
            io.emit('system message', { content: `${sessionUsername} left the chat`, author: 'Admin' });
        });
        
        // Send Message
        socket.on('send message', async (data: MessageData) => {
            try {
                const newMessage = await MessageModel.create({
                    author: data.author,
                    content: data.content,
                    room: data.room,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
        
                io.to(data.room).emit('message received', newMessage); 
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });
    });
};
