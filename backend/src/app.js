const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.use((req, res, next) => {
    console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

app.use(cors({
    origin: (origin, callback) => callback(null, true), // Highly permissive - allows any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    optionsSuccessStatus: 200 // Explicitly set to 200 for broader compatibility
}));

app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const instructorCourseRoutes = require('./routes/instructorCourseRoutes');
const adminCourseRoutes = require('./routes/adminCourseRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/instructor/courses', instructorCourseRoutes);
app.use('/api/admin/courses', adminCourseRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/upload', uploadRoutes);

// Static folders
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Error Handling Middleware (placeholder)
app.use((err, req, res, next) => {
    console.error('❌ Backend Error:', err.message);
    if (err.stack) console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
