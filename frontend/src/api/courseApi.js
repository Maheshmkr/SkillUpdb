import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
};

// ============================================
// INSTRUCTOR COURSE APIs
// ============================================

export const createCourse = async (courseData) => {
    try {
        console.log('🚀 Creating course with data:', courseData);
        console.log('📡 API URL:', API_URL);
        console.log('🔑 Auth headers:', getAuthHeader());

        const response = await axios.post(
            `${API_URL}/instructor/courses`,
            courseData,
            { headers: getAuthHeader() }
        );
        console.log('✅ Course created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error creating course:', error.response?.data || error.message);
        console.error('Full error:', error);
        throw error;
    }
};

export const getInstructorCourses = async () => {
    try {
        console.log('📚 Fetching instructor courses from:', `${API_URL}/instructor/courses`);
        const response = await axios.get(
            `${API_URL}/instructor/courses`,
            { headers: getAuthHeader() }
        );
        console.log('✅ Fetched courses:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching courses:', error.response?.data || error.message);
        throw error;
    }
};

export const getInstructorCourse = async (id) => {
    try {
        console.log(`🔍 Fetching course detail for ID: ${id}`);
        const response = await axios.get(
            `${API_URL}/instructor/courses/${id}`,
            { headers: getAuthHeader() }
        );
        console.log('✅ Fetched course data:', response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching course ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

export const updateCourse = async (id, courseData) => {
    const response = await axios.put(
        `${API_URL}/instructor/courses/${id}`,
        courseData,
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const deleteCourse = async (id) => {
    const response = await axios.delete(
        `${API_URL}/instructor/courses/${id}`,
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const submitCourseForReview = async (id) => {
    const response = await axios.post(
        `${API_URL}/instructor/courses/${id}/submit`,
        {},
        { headers: getAuthHeader() }
    );
    return response.data;
};

// ============================================
// ADMIN COURSE APIs
// ============================================

export const getAllCoursesAdmin = async () => {
    const response = await axios.get(
        `${API_URL}/admin/courses`,
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const getPendingCourses = async () => {
    const response = await axios.get(
        `${API_URL}/admin/courses/pending`,
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const approveCourse = async (id) => {
    const response = await axios.post(
        `${API_URL}/admin/courses/${id}/approve`,
        {},
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const rejectCourse = async (id, reason) => {
    const response = await axios.post(
        `${API_URL}/admin/courses/${id}/reject`,
        { reason },
        { headers: getAuthHeader() }
    );
    return response.data;
};

// ============================================
// PUBLIC COURSE APIs
// ============================================

export const getPublishedCourses = async () => {
    const response = await axios.get(`${API_URL}/courses`);
    return response.data;
};

export const getCourseById = async (id) => {
    const response = await axios.get(`${API_URL}/courses/${id}`);
    return response.data;
};
