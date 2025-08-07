import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authAPI = {
  login: async (credentials) => {
    return await axios.post(`${API_URL}/auth/login`, credentials);
  },

  register: async (userData) => {
    const formData = new FormData();
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('confirmPassword', userData.confirmPassword);
    formData.append('fullName', userData.fullName);
    formData.append('phone', userData.phone);
    formData.append('address', userData.address);
    
    formData.append('agreeToTerms', userData.agreeToTerms);
   

    return await axios.post(`${API_URL}/auth/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  verifyFace: async (faceImage) => {
    const formData = new FormData();
    formData.append('faceImage', faceImage);

    return await axios.post(`${API_URL}/kyc/verify-face`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  verifyToken: async (token) => {
    const response = await axios.get(`${API_URL}/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
  },
};

export { authAPI };