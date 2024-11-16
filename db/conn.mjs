import mongoose from 'mongoose';
import dotenv from 'dotenv';



dotenv.config();  // Loads environment variables from the .env file

// Log the environment variable to see if it's loaded
console.log('MONGO_URI:', process.env.MONGO_URI);  // <-- Add this line

const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!db) {
      throw new Error('Mongo URI is not defined in the environment variables');
    }

    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Mongo DB Connected...');
  } catch (err) {
    console.error(err.message);

    process.exit(1);  // Exit the process with failure code
  }
};

export default connectDB;
