import React, { useState } from 'react';

const RoomLogin: React.FC<{ onLogin: (username: string, roomName: string) => void }> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');

    const handleLogin = () => {
        if (username.trim() !== '' && roomName.trim() !== '') {
            onLogin(username, roomName); // Передаем значение комнаты вместе с именем пользователя
        }
    };

    return (
        <div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            <button onClick={handleLogin}>Login to Room</button>
        </div>
    );
};

export default RoomLogin;