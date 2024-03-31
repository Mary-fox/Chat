import React, { useState } from "react";
import { Input, Button, RoomLoginWrapper, ErrorText } from "./RoomLogin.styled";

const RoomLogin: React.FC<{ onLogin: (username: string, roomName: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username.trim() === "" || roomName.trim() === "") {
      setError("Введите логин и название комнаты");
      return;
    }

    onLogin(username, roomName);
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
      <Button
        onClick={handleLogin}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin();
          }
        }}
      >
        Зайти в комнату
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
    </RoomLoginWrapper>
  );
};

export default RoomLogin;
