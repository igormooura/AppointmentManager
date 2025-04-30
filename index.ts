import { configDotenv } from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectToMongoDb from './config/db'
import appointmentRoutes from './routes/appointmentRoutes'
import { startConsumer } from './config/startConsumer'
import notificationRoutes from './routes/notificationRoutes'

configDotenv()

const app = express()

app.use(cors());
app.use(express.json())
app.use(appointmentRoutes)
app.use(notificationRoutes)


app.get("/", (req, res) => {
    res.send("TESTANDOOO")
})

app.listen(3000, async() => {
    console.log("using port 3000")
    connectToMongoDb();
    startConsumer()
})



