const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const fixIndexes = async () => {
    try {
        await connectDB();
        const db = mongoose.connection.db;
        const collection = db.collection('courses');

        console.log('🔍 Checking indexes for "courses" collection...');
        const indexes = await collection.indexes();
        console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

        const hasIdIndex = indexes.some(idx => idx.name === 'id_1');

        if (hasIdIndex) {
            console.log('🗑️ Dropping unique index "id_1"...');
            await collection.dropIndex('id_1');
            console.log('✅ Index "id_1" dropped successfully!');
        } else {
            console.log('ℹ️ Index "id_1" not found. No action needed.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing indexes:', error);
        process.exit(1);
    }
};

fixIndexes();
