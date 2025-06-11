const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)  
        console.log("Connected to Mongo database");
        
    } catch (error) {
        console.log("MongoDB connection error",error);
        process.exit(1)
    }
    
}
module.exports = connectDB
