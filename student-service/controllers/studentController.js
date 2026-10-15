const mongoose = require('mongoose');
const Student = require('../models/Student');
const axios = require('axios');

// In-Memory store used when MongoDB is offline
const inMemoryStudents = [
  {
    _id: '6601b2c3d4e5f67890123456',
    studentId: 'S001',
    name: 'Nandana R',
    email: '2403717673722031@cit.edu.in',
    courseId: 'C001',
    createdAt: new Date()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { studentId, name, email, courseId } = req.body;

    if (!studentId || !name || !email || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId, name, email, and courseId'
      });
    }

    if (isDbConnected()) {
      const existingStudent = await Student.findOne({ studentId });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: `Student with ID '${studentId}' already exists`
        });
      }

      const newStudent = new Student({
        studentId,
        name,
        email,
        courseId
      });

      await newStudent.save();

      return res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: newStudent
      });
    }

    // In-memory fallback
    const exists = inMemoryStudents.find(s => s.studentId.toLowerCase() === studentId.toLowerCase());
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `Student with ID '${studentId}' already exists`
      });
    }

    const newStudent = {
      _id: 'mem_' + Date.now(),
      studentId,
      name,
      email,
      courseId,
      createdAt: new Date()
    };
    inMemoryStudents.unshift(newStudent);

    return res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating student',
      error: error.message
    });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    if (isDbConnected()) {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    }

    // In-memory fallback
    return res.status(200).json({
      success: true,
      count: inMemoryStudents.length,
      data: inMemoryStudents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students',
      error: error.message
    });
  }
};

// Get student by studentId
exports.getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (isDbConnected()) {
      const student = await Student.findOne({ studentId });
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID '${studentId}' not found`
        });
      }
      return res.status(200).json({
        success: true,
        data: student
      });
    }

    // In-memory fallback
    const student = inMemoryStudents.find(s => s.studentId.toLowerCase() === studentId.toLowerCase());
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${studentId}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student details',
      error: error.message
    });
  }
};

// Inter-Service Communication Endpoint: GET /api/students/:studentId/details
exports.getStudentWithCourseDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Step 1: Find student in DB or in-memory
    let student = null;
    if (isDbConnected()) {
      student = await Student.findOne({ studentId });
    } else {
      student = inMemoryStudents.find(s => s.studentId.toLowerCase() === studentId.toLowerCase());
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${studentId}' not found`
      });
    }

    // Step 2: Fetch course info from Course Service via HTTP REST request
    const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://localhost:5002';
    
    let courseData = null;
    try {
      const response = await axios.get(`${courseServiceUrl}/api/courses/${student.courseId}`);
      if (response.data && response.data.data) {
        courseData = response.data.data;
      }
    } catch (courseErr) {
      console.error(`⚠️ Failed to fetch course ${student.courseId} from Course Service:`, courseErr.message);
      return res.status(503).json({
        success: false,
        message: `Inter-service communication failure: Unable to reach Course Service or course '${student.courseId}' was not found.`,
        student: {
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          courseId: student.courseId
        },
        courseError: courseErr.response?.data?.message || 'Course Service unavailable'
      });
    }

    // Step 3 & 4: Combine student & course details as per requirements specification
    const combinedResponse = {
      student: {
        studentId: student.studentId,
        name: student.name,
        email: student.email
      },
      course: {
        courseId: courseData.courseId,
        courseName: courseData.courseName,
        credits: courseData.credits
      }
    };

    return res.status(200).json(combinedResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while processing combined details',
      error: error.message
    });
  }
};
