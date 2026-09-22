const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;

        // If using local fallback or memory server configuration
        if (!mongoUri || mongoUri.includes('127.0.0.1') || process.env.USE_MEMORY_DB === 'true') {
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            console.log(`Using In-Memory MongoDB Database at: ${mongoUri}`);
        }

        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;