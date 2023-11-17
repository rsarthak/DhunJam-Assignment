import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate(); // Access the navigate function
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const url = 'https://stg.dhunjam.in/account/admin/login';

    const credentials = {
      username: 'DJ@4',
      password: 'Dhunjam@2023',
    };

    try {
      const response = await axios.post(url, credentials);
      setUserId(response.data.data.id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Venue Admin Login</h1>
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="login-input"
        value={formData.username}
        onChange={handleInputChange}
      />
      <div className="password-input-container">
        <input
          type={formData.showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          className="login-input"
          value={formData.password}
          onChange={handleInputChange}
        />
        <FontAwesomeIcon
          icon={formData.showPassword ? faEyeSlash : faEye}
          className="eye-icon"
          onClick={togglePasswordVisibility}
        />
      </div>
      <button type="submit" className="login-button" onClick={handleLogin}>
        Sign in
      </button>
      <a href="#" className="new-registration">
        New Registration?
      </a>
    </div>
  );
};

export default Login;
