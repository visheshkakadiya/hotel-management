import mongoose from 'mongoose';
import { hotelManagement } from '../utils/constants.js';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${hotelManagement}`);
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("fail to connect with MongoDB", error)
        process.exit(1)
    }
}

export default connectDB;