const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Token not found in localStorage');
    }
    return {
        Authorization: `Bearer ${token}`,
    };
};

export default getAuthHeaders