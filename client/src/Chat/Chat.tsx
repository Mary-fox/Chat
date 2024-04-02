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
  const [userState, setUserState] = useState<{
    username: string;
    room: string;
    connected: boolean;
  }>({
    username: localStorage.getItem("username") || "",
    room: "",
    connected: false,
  });
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadedFromDB, setLoadedFromDB] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8001");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessage: MessageItem) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    socket.on("system message", (systemMessage: MessageItem) => {
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    });

    return () => {
      socket.off("system message");
      socket.off("message received");
    };
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      if (userState.room.trim() !== "" && !loadedFromDB) {
        try {
          setLoadedFromDB(true);
          const data = await fetchMessages(userState.room);
          // Добавление новых сообщений к текущему списку
          setMessages((prevMessages) => [...prevMessages, ...data]);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchData();
  }, [userState.room, loadedFromDB]);

  const handleLogin = (username: string, roomName: string) => {
    if (username.trim() !== "" && socket) {
      setUserState({ username, room: roomName, connected: true });
      socket?.connect();
      socket.emit("new login", username);
      socket.emit("join room", { room: roomName, username });
    }
  };

  const handleLeaveRoom = () => {
    if (userState.username.trim() !== "" && socket) {
      socket.disconnect();
      localStorage.clear();
      setUserState({ username: "", room: "", connected: false });
      setMessages([]);
      setLoadedFromDB(false);
    }
  };

  const handleMessageSend = () => {
    if (socket && message.trim() !== "" && userState.room.trim() !== "") {
      const newMessage: MessageItem = {
        id: 0,
        author: userState.username,
        content: message,
        room: userState.room,
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
      {!userState.username ? (
        <RoomLogin onLogin={handleLogin} />
      ) : (
        <ChatContainer>
          {userState.connected ? (
            <>
              <Header>
                <RoomName>Комната: {userState.room}</RoomName>
                <LogoutButton onClick={handleLeaveRoom}>Выход</LogoutButton>
              </Header>

              <MessagesContainer>
                {messages?.map((msg, index) => (
                  <Message key={index} mine={msg.author === userState.username}>
                    {msg.author === "Admin" ? (
                      <span style={{ fontStyle: "italic" }}>{msg.content}</span>
                    ) : (
                      <>
                        <Author>{msg.author}:</Author> <Content>{msg.content}</Content>
                      </>
                    )}
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
