import mongoose from "mongoose"

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected Mongodb: ", conn.connection.host)
    }catch(error){
        console.error("Error connection to the MongoDB: ", error.message)
        process.exit(1) // 1 for failer and 0 for success
    }
};