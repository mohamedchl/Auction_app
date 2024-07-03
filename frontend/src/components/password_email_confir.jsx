// PasswordResetRequestForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PasswordResetRequestForm.css'; // Import the CSS file

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/reset-password-sent/`, {
        email,
      });

      setMessage('If an account with this email exists, a password reset link has been sent.');
      setError('');
    } catch (error) {
      setError('Failed to send password reset link. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="password-reset-container">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
      />
      <div className="password-reset-form">
        <h2>Request Password Reset</h2>
        {message && <p>{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <i className="fas fa-envelope" id="btnbtnbtn"></i>
            <input
              type="email"
              className='input_password'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
          </div>
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequestForm;
