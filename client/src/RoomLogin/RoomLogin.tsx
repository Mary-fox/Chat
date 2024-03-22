import React, { useState } from "react";
import { Input, Button, RoomLoginWrapper } from "./RoomLogin.styled";

const RoomLogin: React.FC<{ onLogin: (username: string, roomName: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleLogin = () => {
    if (username.trim() !== "" && roomName.trim() !== "") {
      onLogin(username, roomName); // Передаем значение комнаты вместе с именем пользователя
    }
  };

  return (
    <RoomLoginWrapper>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <Button onClick={handleLogin}>Зайти в комнату</Button>
    </RoomLoginWrapper>
  );
};

export default RoomLogin;
