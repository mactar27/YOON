export const formatMessage = (message: string): string => {
    return message.trim();
};

export const getCurrentTimestamp = (): string => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const isUserMessage = (sender: string): boolean => {
    return sender === 'user';
};