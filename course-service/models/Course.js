const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: [true, 'Course ID is required'],
    unique: true,
    trim: true
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Course credits are required'],
    min: [1, 'Credits must be at least 1']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
