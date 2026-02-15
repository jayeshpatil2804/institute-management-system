const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const fixIndexesAndResetCounters = async () => {
    await connectDB();

    try {
        const collection = mongoose.connection.collection('students');
        
        console.log('Fetching current indexes...');
        // const indexes = await collection.indexes();
        // console.log('Current Indexes:', indexes);

        console.log('Dropping all indexes on students collection...');
        try {
             await collection.dropIndexes();
             console.log('All student indexes dropped successfully.');
        } catch (e) {
            console.log("No indexes to drop or error dropping:", e.message);
        }

        console.log('Cleaning up empty sparse fields...');
        await collection.updateMany({ regNo: "" }, { $unset: { regNo: 1 } });
        await collection.updateMany({ enrollmentNo: "" }, { $unset: { enrollmentNo: 1 } });
        console.log('Cleanup complete.');

        // --- Reset Counters ---
        const counterCollection = mongoose.connection.collection('counters');
        console.log('Resetting ALL counters (Registration & Enrollment sequences)...');
        try {
            await counterCollection.deleteMany({}); 
            console.log('All counters have been reset to 0.');
        } catch (err) {
            console.log('Error resetting counters:', err.message);
        }

        console.log('DONE. Please restart your backend server.');
        process.exit();
    } catch (error) {
        console.error('Error in fix script:', error);
        process.exit(1);
    }
};

fixIndexesAndResetCounters();
