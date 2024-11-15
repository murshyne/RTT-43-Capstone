// imports
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// SetUps
const app = express();
dotenv.config();
let PORT = process.env.PORT || 3000;

//Connect to DB
connectDB()

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

//Routes

// listener
app.listen(PORT, () => {
  console.log(`Server Running on Port: ${PORT}`);
});
