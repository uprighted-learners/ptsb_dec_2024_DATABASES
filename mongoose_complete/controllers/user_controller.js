import express from "express";

const router = express.Router();

import User from "../models/user.js";
import bcrypt from "bcrypt";

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // const user = new User({
    //   firstName: firstName,
    //   lastName: lastName,
    //   email: email,
    //   password: password
    // });

    // const newUser = await user.save()

    // ? ------- OR ----------------

    // Bcrypt

    const passwordhashed = bcrypt.hashSync(password, +process.env.SALT);

    let newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordhashed,
    });

    // Assign a token

    res.status(200).json({
      Msg: "Success! User was Created!",
      User: newUser,
      // Token:
    });
  } catch (err) {
    res.status(500).json({
      Error:
        err.code === 11000
          ? "Error signing up... probably a duplicate email"
          : err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const foundUser = await User.findOne({ email: email })

    // Can provide custom error message if a user was not found, or something general to relay back to the client
    if (!foundUser) throw new Error("Error logging in") 

    const verifiedPassword = await bcrypt.compare(password, foundUser.password)

    if(!verifiedPassword) throw new Error("Error logging in")
    
    res.status(200).json({
      Msg: "Success! You are logged in!",
      User: foundUser
    })
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find()
      .sort("firstName")
      .select({ firstName: 1, lastName: 1, email: 1 });

    res.status(200).json({
      AllUsers: users,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/one/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    res.status(200).json({
      User: user,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/one/name/:userFirstName", async (req, res) => {
  try {
    // const user = await User.find({ firstName : req.params.userFirstName })

    // Utilizing regex, or a regular expression, within the mongoose library to provide us the benefit of case insensitivity.
    const user = await User.find({
      firstName: { $regex: req.params.userFirstName, $options: "i" },
    }).select({ firstName: 1, lastName: 1, email: 1 });

    res.status(200).json({
      User: user,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.delete("/delete/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    const allUsers = await User.find().select({
      firstName: 1,
      lastName: 1,
      email: 1,
    });

    res.status(200).json({
      Deleted: user,
      Results: allUsers,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.patch("/update/:userId", async (req, res) => {
  try {
    let newInfo = req.body;

    let result = await User.findByIdAndUpdate(req.params.userId, newInfo, {
      new: true,
    });

    res.status(200).json({
      Result: result,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/*", (req, res) => {
  res.send("Wild card endpoint!");
});

export default router;
