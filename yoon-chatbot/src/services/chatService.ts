import axios from 'axios';
import { ChatMessage } from '../types/chat';

const API_URL = 'https://api.yourchatbot.com'; // Replace with your chatbot API URL

export const sendMessage = async (message: ChatMessage): Promise<ChatMessage> => {
    try {
        const response = await axios.post(`${API_URL}/send`, message);
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const fetchResponse = async (userMessage: string): Promise<ChatMessage> => {
    try {
        const response = await axios.post(`${API_URL}/response`, { message: userMessage });
        return response.data;
    } catch (error) {
        console.error('Error fetching response:', error);
        throw error;
    }
};