import axiosInstance from './axiosInstance';

// ============================================
// INSTRUCTOR COURSE APIs
// ============================================

export const createCourse = async (courseData) => {
    try {
        const response = await axiosInstance.post('/instructor/courses', courseData);
        return response.data;
    } catch (error) {
        console.error('❌ Error creating course:', error.response?.data || error.message);
        throw error;
    }
};

export const getInstructorCourses = async () => {
    try {
        const response = await axiosInstance.get('/instructor/courses');
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching courses:', error.response?.data || error.message);
        throw error;
    }
};

export const getInstructorCourse = async (id) => {
    try {
        const response = await axiosInstance.get(`/instructor/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching course ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

export const updateCourse = async (id, courseData) => {
    const response = await axiosInstance.put(`/instructor/courses/${id}`, courseData);
    return response.data;
};

export const deleteCourse = async (id) => {
    const response = await axiosInstance.delete(`/instructor/courses/${id}`);
    return response.data;
};

export const submitCourseForReview = async (id) => {
    const response = await axiosInstance.post(`/instructor/courses/${id}/submit`, {});
    return response.data;
};

// ============================================
// ADMIN COURSE APIs
// ============================================

export const getAllCoursesAdmin = async () => {
    const response = await axiosInstance.get('/admin/courses');
    return response.data;
};

export const getPendingCourses = async () => {
    const response = await axiosInstance.get('/admin/courses/pending');
    return response.data;
};

export const approveCourse = async (id) => {
    const response = await axiosInstance.post(`/admin/courses/${id}/approve`, {});
    return response.data;
};

export const rejectCourse = async (id, reason) => {
    const response = await axiosInstance.post(`/admin/courses/${id}/reject`, { reason });
    return response.data;
};

// ============================================
// PUBLIC COURSE APIs
// ============================================

export const getPublishedCourses = async () => {
    const response = await axiosInstance.get('/courses');
    return response.data;
};

export const getCourseById = async (id) => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data;
};
