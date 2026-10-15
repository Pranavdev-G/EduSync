const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentWithCourseDetails
} = require('../controllers/studentController');

router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:studentId/details', getStudentWithCourseDetails);
router.get('/:studentId', getStudentById);

module.exports = router;
