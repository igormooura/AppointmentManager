import { configDotenv } from 'dotenv';
import express from 'express';
import cors from "cors";
import { createServer } from 'node:http';
import connectToMongoDb from './config/connectToMongoDb';
import { connectToRabbitMQ } from './config/rabbitmq';

configDotenv();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

server.listen(3000, async() => {
    connectToMongoDb();
    connectToRabbitMQ();
});