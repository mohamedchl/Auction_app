import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from 'react-router-dom';
import api from "../api";


const GoogleLoginComponent = () => {
    const navigate = useNavigate();
  const handleLoginSuccess = async (response) => {
  

    const token = response.credential;
    try {
      const res = await api.post(`${import.meta.env.VITE_API_URL}/api/google-login/`, { token });
      console.log(res.data);
      localStorage.setItem(ACCESS_TOKEN, res.data.access_token);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh_token);
      if (window.location.pathname === '/') {
        window.location.reload(); // Refresh the page
      } else {
        navigate("/");
      }

        } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure (e.g., show error message)
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
    // Handle login failure (e.g., show error message)
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginFailure}
    />
  );
};

export default GoogleLoginComponent;
