const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const courseRoutes = require('./routes/courseRoutes');

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/course_db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courses', courseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Course Service' });
});

// Disable command buffering so operations don't freeze when MongoDB is offline
mongoose.set('bufferCommands', false);

// Attempt MongoDB Connection asynchronously without blocking server startup
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => {
    console.log('✅ Connected to MongoDB (Course Service DB)');
  })
  .catch((err) => {
    console.log('💡 Note: Course Service running with In-Memory fallback store (MongoDB not connected)');
  });

// Start Express Server immediately
const server = app.listen(PORT, () => {
  console.log(`🚀 Course Microservice is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Course Service is already running on port ${PORT}; using the existing instance.`);
    mongoose.disconnect().finally(() => process.exit(0));
    return;
  }

  console.error('Course Service failed to start:', err.message);
  mongoose.disconnect().finally(() => process.exit(1));
});

