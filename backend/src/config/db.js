const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // In serverless, we don't process.exit(1) as it crashes the whole instance.
        // We throw the error so the request fails gracefully and Vercel can retry.
        throw error;
    }
};

module.exports = connectDB;
