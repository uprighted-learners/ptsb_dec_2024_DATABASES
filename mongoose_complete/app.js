import dotenv from "dotenv"
dotenv.config()

import express from "express" 

import mongoose from "mongoose"

// import userController from "./controllers/user_controller.js"

import { userController, postController } from "./controllers/index.js"

// Importing validate-session middleware function
import validateSession from "./middleware/validate-session.js"


const app = express()

//? Connection URI variable from .env
const MONGODB = process.env.MONGO_DB_URI + "/" + process.env.MONGO_DB_NAME

//? Connection middleware, connect to our db
mongoose.connect(MONGODB)

//? Storing the connection status 
const db = mongoose.connection

// MIDDLEWARE

app.use(express.json())


app.use("/users", userController)

// Use validation middleware
app.use(validateSession)

app.use("/posts", postController)

db.once("open", () => {
    console.log(`Connected successfully to Database: ${process.env.MONGO_DB_NAME}`);
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
})