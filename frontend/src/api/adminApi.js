import axiosInstance from "./axiosInstance";

export const getInstructors = async () => {
    const { data } = await axiosInstance.get('/admin/users/instructors');
    return data;
};

export const createInstructor = async (instructorData) => {
    const { data } = await axiosInstance.post('/admin/users/instructor', instructorData);
    return data;
};

export const deleteInstructor = async (id) => {
    const { data } = await axiosInstance.delete(`/admin/users/instructor/${id}`);
    return data;
};

export const approveCourse = async (id) => {
    const { data } = await axiosInstance.post(`/admin/courses/${id}/approve`);
    return data;
};

export const rejectCourse = async (id, reason) => {
    const { data } = await axiosInstance.post(`/admin/courses/${id}/reject`, { reason });
    return data;
};
