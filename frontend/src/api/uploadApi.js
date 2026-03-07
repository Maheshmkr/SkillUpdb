import axiosInstance from './axiosInstance';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axiosInstance.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // { url, message }
    } catch (error) {
        console.error('Error uploading image:', error.response?.data || error.message);
        throw error;
    }
};
