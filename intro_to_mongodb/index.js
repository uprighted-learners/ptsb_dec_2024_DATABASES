// Import dotenv before anything else
require("dotenv").config();

// Import express lib
const express = require("express");

// Import MongoClient
const { MongoClient, ObjectId } = require("mongodb");

const PORT = process.env.PORT || 5000;

// Instantiating our express app
const app = express();

// Middleware - allowing our express app to take in json
app.use(express.json());

const MONGO_URI = "mongodb://localhost:27017/";
// const MONGO_URI = "mongodb://0.0.0.0:27017/"

const DB_NAME = "testdb";
const COLLECTION_NAME = "testtable";

// Assigning a connection to our local db server
const client = new MongoClient(MONGO_URI);

// Creating a fn that will connect to our database and a specific table/collection
async function dbConnect() {
  try {
    // Connect to the db server
    await client.connect();

    let db = client.db(DB_NAME);

    if (client.topology.isConnected()) {
      console.log("Successfully connected to the database");
    } else {
      console.log("Not connected to the database");
    }

    let collection = db.collection(COLLECTION_NAME);

    return collection;
  } catch (err) {
    console.log(`Error connecting to the database: ${err.message}`);
  }
}

app.post("/create", async (req, res) => {
  try {
    let newUser = req.body;
    let userCollection = await dbConnect();

    await userCollection.insertOne(newUser);

    res.status(200).json({
      Created: newUser,
      Status: "Success",
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

app.get("/userdata", async (req, res) => {
  try {
    let userCollection = await dbConnect();

    let userList = await userCollection.find().toArray();

    res.status(200).json({
      allUsers: userList,
    });
    
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

app.get("/userdata/:userId", async (req, res) => {
  try {
    let userCollection = await dbConnect()
    let userList = await userCollection.find({_id: new ObjectId(req.params.userId)}).toArray()

    console.log(userList);

    res.status(200).json({
        Result: userList
    });
    
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

// Spin up our server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
