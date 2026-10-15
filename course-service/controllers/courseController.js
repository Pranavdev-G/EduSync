const mongoose = require('mongoose');
const Course = require('../models/Course');

// In-Memory store used when MongoDB is offline
const inMemoryCourses = [
  {
    _id: '6601a1b2c3d4e5f678901234',
    courseId: 'C001',
    courseName: 'Full Stack Application Development',
    credits: 4,
    createdAt: new Date()
  },
  {
    _id: '6601a1b2c3d4e5f678901235',
    courseId: 'C002',
    courseName: 'Cloud Computing & Microservices',
    credits: 3,
    createdAt: new Date()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { courseId, courseName, credits } = req.body;

    if (!courseId || !courseName || credits === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId, courseName, and credits'
      });
    }

    if (isDbConnected()) {
      const existingCourse = await Course.findOne({ courseId });
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: `Course with ID '${courseId}' already exists`
        });
      }

      const newCourse = new Course({
        courseId,
        courseName,
        credits: Number(credits)
      });

      await newCourse.save();

      return res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: newCourse
      });
    }

    // In-memory fallback
    const exists = inMemoryCourses.find(c => c.courseId.toLowerCase() === courseId.toLowerCase());
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `Course with ID '${courseId}' already exists`
      });
    }

    const newCourse = {
      _id: 'mem_' + Date.now(),
      courseId,
      courseName,
      credits: Number(credits),
      createdAt: new Date()
    };
    inMemoryCourses.unshift(newCourse);

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating course',
      error: error.message
    });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    if (isDbConnected()) {
      const courses = await Course.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
      });
    }

    // In-memory fallback
    return res.status(200).json({
      success: true,
      count: inMemoryCourses.length,
      data: inMemoryCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
      error: error.message
    });
  }
};

// Get course by courseId
exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (isDbConnected()) {
      const course = await Course.findOne({ courseId });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Course with ID '${courseId}' not found`
        });
      }
      return res.status(200).json({
        success: true,
        data: course
      });
    }

    // In-memory fallback
    const course = inMemoryCourses.find(c => c.courseId.toLowerCase() === courseId.toLowerCase());
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with ID '${courseId}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course details',
      error: error.message
    });
  }
};
