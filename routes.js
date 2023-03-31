const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { User, Course } = require("./models");

// Construct a router instance.
const router = express.Router();

// User Routes

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

// Course Routes

// Route that returns a list of courses (including the user that owns each course).
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    res.json(courses).status(200);
  })
);

// Route that returns a course (including the user that owns the course) for the provided course ID.
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });
    res.json(course).status(200);
  })
);

// Route that creates a new course, sets the Location header to the URI for the course, and returns no content.
router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.status(201).setHeader("Location", `/courses/${course.id}`).end();
  })
);

// Route that updates a course and returns no content.
router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.update(req.body);
    res.status(204).end();
  })
);

// Route that deletes a course and returns no content.
router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).end();
  })
);
module.exports = router;
