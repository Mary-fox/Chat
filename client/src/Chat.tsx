import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

const Chat: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const [connected, setConnected] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (socket) {
            socket.on('message received', (newMessage: any) => {
                // Обновить интерфейс  приложения с новым сообщением
                console.log('New message received:', newMessage);
            });
        }
    
        return () => {
            if (socket) {
                socket.off('message received'); // Убрать обработчик события при размонтировании компонента
            }
        };
    }, [socket]);
    useEffect(() => {
        const newSocket = io('http://localhost:8001');

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setConnected(false);
        });

        newSocket.on('message received', (newMessage: any) => {
            setMessages([...messages, newMessage]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleLogin = () => {
        if (socket && username.trim() !== '') {
            socket.emit('new login', { username });
        }
    };

    const handleMessageSend = () => {
        if (socket && message.trim() !== '') {
            socket.emit('send message', { author: username, content: message });
            setMessage('');
        }
    };

    return (
        <div>
            {connected ? (
                <div>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <button onClick={handleLogin}>Login</button>
                    <hr />
                    <div>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.author}</strong>: {msg.content}
                            </div>
                        ))}
                    </div>
                    <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={handleMessageSend}>Send Message</button>
                </div>
            ) : (
                <p>Disconnected from server</p>
            )}
        </div>
    );
};

export default Chat;
