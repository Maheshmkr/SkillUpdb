// Test script to verify backend API connectivity
const axios = require('axios');

const API_URL = 'https://skill-up-backend-lime.vercel.app/api';

async function testBackend() {
    console.log('🧪 Testing Backend API Connectivity...\n');

    // Test 1: Check if backend is running
    try {
        console.log('1️⃣ Testing if backend is running...');
        const response = await axios.get('http://localhost:5000');
        console.log('✅ Backend is running:', response.data);
    } catch (error) {
        console.error('❌ Backend is NOT running:', error.message);
        return;
    }

    // Test 2: Check public courses endpoint
    try {
        console.log('\n2️⃣ Testing public courses endpoint...');
        const response = await axios.get(`${API_URL}/courses`);
        console.log('✅ Public courses endpoint works');
        console.log('   Courses found:', response.data.length);
    } catch (error) {
        console.error('❌ Public courses endpoint failed:', error.response?.data || error.message);
    }

    // Test 3: Test login
    try {
        console.log('\n3️⃣ Testing login with instructor credentials...');
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'instructor@skillup.com',
            password: 'password123'
        });
        console.log('✅ Login successful');
        console.log('   User:', response.data.name);
        console.log('   Role:', response.data.role);
        const token = response.data.token;

        // Test 4: Test creating a course
        try {
            console.log('\n4️⃣ Testing course creation...');
            const courseData = {
                title: 'Test Course',
                category: 'Technology',
                level: 'Beginner',
                price: 49.99,
                whatYouWillLearn: ['Test learning point'],
                modules: []
            };
            const courseResponse = await axios.post(
                `${API_URL}/instructor/courses`,
                courseData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('✅ Course created successfully!');
            console.log('   Course ID:', courseResponse.data._id);
            console.log('   Course Title:', courseResponse.data.title);
            console.log('   Status:', courseResponse.data.status);
        } catch (error) {
            console.error('❌ Course creation failed:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
    }
}

testBackend();
