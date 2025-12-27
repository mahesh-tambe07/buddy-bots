import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Register.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from '../components/GoogleLoginButton'; // ✅ import the button

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Password and Confirm Password must match.',
        confirmButtonColor: '#f512c0',
      });
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      password: form.password,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', payload);
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You can now log in with your credentials.',
        confirmButtonColor: '#1cd6eb',
      }).then(() => {
        navigate('/login');
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.message || err.message || 'Something went wrong.',
        confirmButtonColor: '#f512c0',
      });
    }
  };

  return (
    <GoogleOAuthProvider clientId="380766267990-n0mvq5qd9383rei6tllonpdrb05ve4t6.apps.googleusercontent.com">
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Register</h2>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />

          <button type="submit">Register</button>

          {/* ✅ Google login button below the form */}
          <div style={{ marginTop: '10px' }}>
            <GoogleLoginButton />
          </div>

          <p className="signin-text">
            Already have an account? <Link to="/login" className="signin-link">Sign In</Link>
          </p>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
