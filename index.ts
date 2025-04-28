import { configDotenv } from 'dotenv'
import express from 'express'
import connectToMongoDb from './config/db'
import appointmentRoutes from './routes/appointmentRoutes'
import { startConsumer } from './config/startConsumer'

configDotenv()

const app = express()

app.use(express.json())
app.use(appointmentRoutes)


app.get("/", (req, res) => {
    res.send("TESTANDOOO")
})

app.listen(3000, async() => {
    console.log("using port 3000")
    connectToMongoDb();
    startConsumer()
})


