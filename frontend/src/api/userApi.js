import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
};

export const getUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/profile`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error.response?.data || error.message);
        throw error;
    }
};

export const getUserProgress = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/users/progress/${courseId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Error fetching progress for course ${courseId}:`, error.response?.data || error.message);
        throw error;
    }
};

export const updateCourseProgress = async (progressData) => {
    try {
        const response = await axios.put(`${API_URL}/users/progress`, progressData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Error updating course progress:', error.response?.data || error.message);
        throw error;
    }
};

export const enrollInCourse = async (courseId) => {
    try {
        const response = await axios.post(`${API_URL}/users/enroll`, { courseId }, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Error enrolling in course:', error.response?.data || error.message);
        throw error;
    }
};
