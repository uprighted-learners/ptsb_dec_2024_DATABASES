/* 
Validate session will process a token from the jwt library.
It will decrypt that token, to pluck out the user id from it.
Then it will query our User table to see if a matching user exists.
If so, attach that user to the req object.

Access to (req, res, next)

*/

import jwt from "jsonwebtoken"

const validateSession = async (req, res, next) => {
  try {
    console.log("Endpoint was hit");

    // Take the token provided by the request object
    const auth = req.headers.authorization

    if (!auth) throw new Error("Authorization header not provided") 
    // ? OR
    // if (!auth) throw new Error("Unauthorized") 

    const token = auth.split(" ")[1]

    if(!token) throw new Error("Invalid Token")

    const decoded = jwt.verify(token, process.env.JWT_SECRET )
    console.log("Decoded: ",decoded);

    console.log("Auth split?", );

    return next();
  } catch (err) {
    console.log(err.code);
    res.status(500).json({
      ValidateError: err.message.includes("expired") ? "Token expired, please signup or login again" : err.message,
    });
  }
};

export default validateSession