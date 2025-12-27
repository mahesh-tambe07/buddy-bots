// src/components/GoogleLoginButton.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Swal from 'sweetalert2';
import './GoogleLoginButton.css'; // (Optional) if you want to style your button

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // Send the token to your backend
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        token,
      });

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome!',
        confirmButtonColor: '#1cd6eb',
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      console.error('❌ Google Login Error:', err.message || err);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Google login failed. Please try again.',
        confirmButtonColor: '#f512c0',
      });
    }
  };

  const handleError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Google Login Failed',
      text: 'Please try again.',
      confirmButtonColor: '#f512c0',
    });
  };

  return (
    <div className="custom-google-button-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap // optional: enables one-tap sign-in
      />
    </div>
  );
};

export default GoogleLoginButton;
