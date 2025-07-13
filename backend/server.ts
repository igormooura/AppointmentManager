import { configDotenv } from 'dotenv';
import express from 'express';
import cors from "cors";
import { createServer } from 'node:http';
import connectToMongoDb from './config/connectToMongoDb';
import { connectToRabbitMQ } from './config/rabbitmq';
import router from './routes/routes';
import { startRabbitMQReceiver } from './config/receiver';
import { initSocket } from './config/socket';
import authRouter from './routes/authroutes';

configDotenv();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

app.use(router)
app.use("/auth", authRouter);

async function startServer() {
  try {
    await connectToMongoDb();
    await connectToRabbitMQ();
    await startRabbitMQReceiver();
    await initSocket(server);


    server.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();