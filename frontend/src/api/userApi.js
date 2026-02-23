import axiosInstance from './axiosInstance';

export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/users/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error.response?.data || error.message);
        throw error;
    }
};

export const getUserProgress = async (courseId) => {
    try {
        const response = await axiosInstance.get(`/users/progress/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching progress for course ${courseId}:`, error.response?.data || error.message);
        throw error;
    }
};

export const updateCourseProgress = async (progressData) => {
    try {
        const response = await axiosInstance.put('/users/progress', progressData);
        return response.data;
    } catch (error) {
        console.error('Error updating course progress:', error.response?.data || error.message);
        throw error;
    }
};

export const enrollInCourse = async (courseId) => {
    try {
        const response = await axiosInstance.post('/users/enroll', { courseId });
        return response.data;
    } catch (error) {
        console.error('Error enrolling in course:', error.response?.data || error.message);
        throw error;
    }
};
