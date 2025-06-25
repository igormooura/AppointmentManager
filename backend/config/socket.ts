import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer;

export const initSocket = (server: Server) => {
  io = new SocketIOServer(server, { cors: { origin: "*" } });

  io.on("connection", (socket: Socket) => {
    // console.log("Client connected:", socket.id);

    socket.on("joinRoom", (email: string) => {
      socket.join(email);
      //console.log(`${socket.id} joined room ${email}`);
    });

    socket.on("disconnect", () => {
    //   console.log("Client disconnected:", socket.id);
    });
  });
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};
