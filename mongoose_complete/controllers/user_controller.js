import express from "express";

const router = express.Router();

import User from "../models/user.js";

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

    let newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    res.status(200).json({
      Msg: "Success! User was Created!",
      User: newUser,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find().sort("firstName").select({firstName: 1, lastName: 1, email: 1});

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

export default router;
