const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 59238;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    service: 'Student Service',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-Memory Store Active'
  });
});

// Disable command buffering so operations don't freeze when MongoDB is offline
mongoose.set('bufferCommands', false);

// Attempt MongoDB Connection asynchronously without blocking server startup
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => {
    console.log('✅ Connected to MongoDB (Student Service DB)');
  })
  .catch((err) => {
    console.log('💡 Note: Student Service running with In-Memory fallback store (MongoDB not connected)');
  });

// Start Express Server immediately
app.listen(PORT, () => {
  console.log(`🚀 Student Microservice is running on http://localhost:${PORT}`);
});
