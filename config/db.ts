import mongoose from "mongoose";

const connectToMongoDb = async () => { 
    try{
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@appointmentmanager.jo5zpup.mongodb.net/?retryWrites=true&w=majority&appName=AppointmentManager`
        );
        console.log("Connected to DB!")
    } catch(error){
        console.log("Error connecting to Db: ", error)
        process.exit(1);
    }
}

export default connectToMongoDb