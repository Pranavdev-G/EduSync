const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById
} = require('../controllers/courseController');

router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/:courseId', getCourseById);

module.exports = router;
