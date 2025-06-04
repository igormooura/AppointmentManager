import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectToMongoDb from './config/db';
import appointmentRoutes from './routes/appointmentRoutes';
import { startConsumer } from './config/startConsumer';
import notificationRoutes from './routes/notificationRoutes';
import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { setIo } from './config/socketManager';

configDotenv();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

setIo(io);

app.use(cors());
app.use(express.json());
app.use(appointmentRoutes);
app.use(notificationRoutes);

io.on('connection', (socket) => {
    socket.on('join_room', (roomName: string) => {
        socket.join(roomName);
    });

    socket.on('disconnect', () => {});
});

app.get("/", (req, res) => {
    res.send("TESTANDOOO");
});

server.listen(3000, async() => {
    connectToMongoDb();
    startConsumer();
});