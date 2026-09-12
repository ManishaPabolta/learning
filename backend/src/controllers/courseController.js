const Course = require("../models/Course");
const User = require("../models/User");

// =====================================================
// CREATE COURSE
// =====================================================

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and category are required",
      });
    }

    // Create course
    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),

      // Logged-in admin becomes instructor
      instructor: req.user._id,
    });

    // Populate instructor details
    await course.populate(
      "instructor",
      "name email"
    );

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error(
      "Create Course Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL COURSES
// =====================================================

exports.getCourses = async (req, res) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const search =
      req.query.search || "";

    const query = {
      title: {
        $regex: search,
        $options: "i",
      },
    };

    const courses = await Course.find(query)
      .populate(
        "instructor",
        "name email"
      )
      .populate(
        "students",
        "name email"
      )
      .skip((page - 1) * limit)
      .limit(limit);

    const total =
      await Course.countDocuments(query);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      courses,
    });
  } catch (error) {
    console.error(
      "Get Courses Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET COURSE BY ID
// =====================================================

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate(
        "instructor",
        "name email"
      )
      .populate(
        "students",
        "name email"
      );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error(
      "Get Course By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE COURSE
// =====================================================

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
    } = req.body;

    const course =
      await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update title
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Course title cannot be empty",
        });
      }

      course.title = title.trim();
    }

    // Update description
    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Course description cannot be empty",
        });
      }

      course.description =
        description.trim();
    }

    // Update category
    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Course category cannot be empty",
        });
      }

      course.category =
        category.trim();
    }

    await course.save();

    // Populate instructor
    await course.populate(
      "instructor",
      "name email"
    );

    // Populate students
    await course.populate(
      "students",
      "name email"
    );

    return res.status(200).json({
      success: true,
      message:
        "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error(
      "Update Course Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE COURSE
// =====================================================

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course =
      await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Course deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Course Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// ENROLL COURSE
// =====================================================

exports.enrollCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Find course
    const course =
      await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Find logged-in user
    const user =
      await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already enrolled
    const alreadyEnrolled =
      course.students.some(
        (studentId) =>
          studentId.toString() ===
          user._id.toString()
      );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message:
          "You are already enrolled in this course",
      });
    }

    // Add student to course
    course.students.push(user._id);

    // Make sure enrolledCourses exists
    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(
      course._id
    );

    await course.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Enrolled successfully",
    });
  } catch (error) {
    console.error(
      "Enroll Course Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};