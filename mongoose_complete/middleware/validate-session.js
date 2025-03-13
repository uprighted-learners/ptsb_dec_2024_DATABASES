/* 
Validate session will process a token from the jwt library.
It will decrypt that token, to pluck out the user id from it.
Then it will query our User table to see if a matching user exists.
If so, attach that user to the req object.

Access to (req, res, next)

*/

import jwt from "jsonwebtoken"
import User from "../models/user.js"

const validateSession = async (req, res, next) => {
  try {

    // Take the token provided by the request object
    const auth = req.headers.authorization

    // If no auth, throw error
    if (!auth) throw new Error("Authorization header not provided") 
    // ? OR
    // if (!auth) throw new Error("Unauthorized") 

    // Get the second word from the string  "Bearer TOKEN_HERE"
    const token = auth.split(" ")[1]

    if(!token) throw new Error("Invalid Token")

    // Allow the jwt library to decrypt our token, using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET )
    
    // Querying our User tables to find the user with the matching id
    const user = await User.findById(decoded.id)

    if(!user) throw new Error("User not found!")
    
    req.user = user

    next();
  } catch (err) {
    console.log(err.code);
    res.status(500).json({
      ValidateError: err.message.includes("expired") ? "Token expired, please signup or login again" : err.message,
    });
  }
};

export default validateSession