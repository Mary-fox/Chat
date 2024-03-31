import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

import RoomLogin from "../RoomLogin/RoomLogin";
import {
  Author,
  Button,
  ChatContainer,
  Container,
  Content,
  Header,
  Input,
  LogoutButton,
  Message,
  MessagesContainer,
  RoomName,
  SendBtnContainer,
} from "./Chat.styled";
import { fetchMessages } from "../http/apiTasks";

interface MessageItem {
  id: number;
  author: string;
  content: string;
  room: string;
  createdAt: string;
  updatedAt: string;
}

const Chat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(localStorage.getItem("username") || "");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [room, setRoom] = useState<string>("");
  const [loadedFromDB, setLoadedFromDB] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8001");

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    newSocket.on("message received", (newMessage: MessageItem) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (messages.length === 0 && room.trim() !== "" && !loadedFromDB) {
        try {
          setLoadedFromDB(true);
          const data = await fetchMessages(room);
          setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchData();
  }, [messages.length, room, loadedFromDB]);

  const handleLogin = (username: string, roomName: string) => {
    if (username.trim() !== "") {
      setUsername(username);
      setRoom(roomName);

      socket?.emit("new login", { username });
      socket?.emit("join room", roomName, username);

      const adminMessage: MessageItem = {
        id: 0,
        author: "Админ",
        content: `Добро пожаловать, ${username}!`,
        room: roomName,
        createdAt: "",
        updatedAt: "",
      };
      socket?.emit("send message", adminMessage);
      setConnected(true);
    }
  };

  const handleLeaveRoom = () => {
    localStorage.clear();
    setUsername("");
    setRoom("");
    setMessages([]);
    setLoadedFromDB(false);
    setConnected(false);
    socket?.disconnect();
  };

  const handleMessageSend = () => {
    if (socket && message.trim() !== "" && room.trim() !== "") {
      const newMessage: MessageItem = {
        id: 0,
        author: username,
        content: message,
        room: room,
        createdAt: "",
        updatedAt: "",
      };
      socket.emit("send message", newMessage);
      setMessage("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Container>
      {!username ? (
        <RoomLogin onLogin={handleLogin} />
      ) : (
        <ChatContainer>
          {connected ? (
            <>
              <Header>
                <RoomName>Комната: {room}</RoomName>
                <LogoutButton onClick={handleLeaveRoom}>Выход</LogoutButton>
              </Header>

              <MessagesContainer>
                {messages?.map((msg, index) => (
                  <Message key={index} mine={msg.author === username}>
                    <Author>{msg.author}:</Author> <Content>{msg.content}</Content>
                  </Message>
                ))}
                <div ref={messagesEndRef} />
              </MessagesContainer>
              <SendBtnContainer>
                <Input
                  type="text"
                  placeholder="Текст сообщения"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleMessageSend();
                    }
                  }}
                />
                <Button onClick={handleMessageSend}>Отправить</Button>
              </SendBtnContainer>
            </>
          ) : (
            <p>Сервер недоступен. Грусть, печаль, тоска</p>
          )}
        </ChatContainer>
      )}
    </Container>
  );
};

export default Chat;
