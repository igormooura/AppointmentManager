import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const setIo = (io: SocketIOServer): void => {
    ioInstance = io;
};

export const getIo = (): SocketIOServer | null => {
    if (!ioInstance) {
        console.warn("Socket.IO instance has not been set yet.");
    }
    return ioInstance;
};