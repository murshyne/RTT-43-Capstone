// imports
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from './db/conn.mjs';
import cors from 'cors';
import userRoutes from './routes/api/usersRoute.mjs';
import authRoutes from './routes/api/authRoute.mjs';

// SetUps
const app = express();
dotenv.config();
let PORT = process.env.PORT || 3000;

//Connect to DB
connectDB()

// Initialize middleware
app.use(express.json({ extended: false }));
app.use(cors());

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

//Single API test endpoint. Send data to browser
app.get('/', (req, res) => res.send('It is Working !!! API Running'));

//Routes
app.use('/api/usersRoute', userRoutes);
app.use('/api/authRoute', authRoutes);


// listener
app.listen(PORT, () => {
  console.log(`Server Running on Port: ${PORT}`);
});
