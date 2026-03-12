export const getSafeUserInfo = () => {
    try {
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) return {};
        const userInfo = JSON.parse(userInfoStr);
        return typeof userInfo === 'object' && userInfo !== null ? userInfo : {};
    } catch (error) {
        console.error('Error parsing userInfo from localStorage:', error);
        return {};
    }
};
