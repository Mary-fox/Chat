import { $host } from "./Api";

export const fetchMessages = async (room: string) => {
  try {
    const response = await $host.get(`/api/messages?room=${room}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
