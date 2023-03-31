const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { authenticateUser } = require("./middleware/auth-user");
const { User, Course } = require("./models");

// Construct a router instance.
const router = express.Router();

// User Routes

// Route that returns the currently authenticated user.
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res
      .json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        confirmedPassword: user.confirmedPassword,
      })
      .status(200);
  })
);

// Route that creates a new user and sets the Location header to "/".
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).setHeader("Location", "/").end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
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
    try {
      const course = await Course.findByPk(req.params.id, {
        include: [
          {
            model: User,
          },
        ],
      });
      res.json(course).status(200);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// Route that creates a new course, sets the Location header to the URI for the course, and returns no content.
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.status(201).setHeader("Location", `/courses/${course.id}`).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// Route that updates a course and returns no content.
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (!req.body.title || !req.body.description) {
        res
          .status(400)
          .json({ message: "Please give a title and description" })
          .end();
      } else {
        await course.update(req.body);
        res.status(204).end();
      }
    } else {
      res.status(404).json({ message: "Course not found" }).end();
    }
  })
);

// Route that deletes a course and returns no content.
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      await course.destroy();
      res.status(204).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        res.status(404).json({ message: "Course not found" }).end();
      }
    }
  })
);
module.exports = router;
