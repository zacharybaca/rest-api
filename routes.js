const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { User, Course } = require("./models");

// Construct a router instance.
const router = express.Router();

// Route that returns the currently authenticated user.
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(1);

    res
      .json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password,
      })
      .status(200);
  })
);

// Route that creates a new user and sets the Location header to "/".
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    await User.create(req.body);
    res.status(201).setHeader("Location", "/").end();
  })
);

module.exports = router;
