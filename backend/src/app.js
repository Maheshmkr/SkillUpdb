const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const instructorCourseRoutes = require('./routes/instructorCourseRoutes');
const adminCourseRoutes = require('./routes/adminCourseRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/instructor/courses', instructorCourseRoutes);
app.use('/api/admin/courses', adminCourseRoutes);

// Error Handling Middleware (placeholder)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
