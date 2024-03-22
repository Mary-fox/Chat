import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 80%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 60vh;
  padding: 10px;
`;

export const Header = styled.div`
  display: flex;
  width: 97%;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  align-items: baseline;
  margin-bottom: 10px;
  padding: 10px;
`;

export const Message = styled.div<{ mine?: boolean }>`
  background-color: ${({ mine }) => (mine ? "#DCF8C6" : "#ECE5DD")};
  border-radius: 10px;
  padding: 10px;
  align-self: ${({ mine }) => (mine ? "flex-end" : "flex-start")};
`;

export const Author = styled.span<{ mine?: boolean }>`
  font-weight: bold;
  color: ${({ mine }) => (mine ? "#085F6D" : "#A2A2A2")};
`;

export const Content = styled.span``;

export const SendBtnContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  outline: none;
  background-color: #f0f2f5;
`;

export const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export const LogoutButton = styled(Button)`
  background-color: #dc3545;
  margin-top: 10px;
  height: 35px;
  &:hover {
    background-color: #c82333;
  }
`;

export const RoomName = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;
