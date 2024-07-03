import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/passwordReset.css'; // Using the same CSS file

const PasswordResetForm = () => {
  const { encoded_pk, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [formClass, setFormClass] = useState('');
  const [messageClass, setMessageClass] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reset-password-page/`, {
        encoded_pk,
        token,
        password,
      });

      setFormClass('slide-out'); // Trigger the slide-out animation
      setTimeout(() => {
        setMessage('Your password has been reset successfully');
        setMessageClass('show'); // Show the message after the form slides out
        setFormClass('hidden'); // Hide the form
      }, 1000);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      setMessage('');
    }
  };

  const togglePasswordVisibility = (num) => {
    switch (num) {
      case 1:
        setIsPasswordVisible(!isPasswordVisible);
        break;
      case 2:
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
        break;
      default:
        setIsPasswordVisible(!isPasswordVisible);
        break;
    }
  };

  return (
    <div id="password-reset-container">
      <div id="password-reset-form" className={formClass}>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
        />
        <div id="password-reset-title">
          <h2>Reset Your Password</h2>
          {error && <p id="error-message">{error}</p>}
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" id="password-reset-form-element">
          <div className="input-container" id="password-reset-input-container-1">
            <i className="fas fa-lock input-icon" id="password-icon-1"></i>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
              autoComplete="new-password"
              id="input-password"
            />
            <div className="toggle-visibility" onClick={() => togglePasswordVisibility(1)} id="password-visibility-toggle-1">
              <i className={isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'} id="visibility-icon-1"></i>
            </div>
          </div>
          <div className="input-container" id="password-reset-input-container-2">
            <i className="fas fa-lock input-icon" id="password-icon-2"></i>
            <input
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
              autoComplete="new-password"
              id="input-confirm-password"
            />
            <div className="toggle-visibility" onClick={() => togglePasswordVisibility(2)} id="password-visibility-toggle-2">
              <i className={isConfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'} id="visibility-icon-2"></i>
            </div>
          </div>
          <button type="submit" id="password-reset-submit">Reset Password</button>
        </form>
      </div>
      {message && <p id="password-reset-message" className={messageClass}>{message}</p>}
    </div>
  );
};

export default PasswordResetForm;
