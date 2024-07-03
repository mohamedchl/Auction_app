// PasswordResetRequestForm.jsx
import background_car from '../assets/photos/Exemples/car_background.png';
import mini_logo from '../assets/photos/mini_logo.png';

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PasswordResetRequestForm.css'; // Import the CSS file
import GoogleLoginComponent from './googlecompenment';
import { GoogleOAuthProvider } from '@react-oauth/google';

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [RegisterForm, setRegisterForm] = useState('register-container');
  const [Emailcontainer, setEmailcontainer] = useState('verify_email_present');
  const [loading, setLoading] = useState(false);
  const [showgoogle, setshowgoogle] = useState(false);

  
  const handleemailchange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value === '') {
        setEmailError('');
    } 
};
  const handleSubmit = async (e) => {
    e.preventDefault();
   setLoading(true)
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/reset-password-sent/`, {
            email,
        });
        if (response.data.message === "Google account") {
          setshowgoogle(true)
          setEmail('')
      } 
        setRegisterForm("register-container-slideleft")
        setEmailcontainer("verify_email_sent")}
    
     catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                // Handle validation errors
                const errorMessage = error.response.data.email ? error.response.data.email[0] : 'Invalid input.';
                setError(errorMessage);
            } else if (error.response.status === 404) {
                setError("Aucun compte associé à cet email n'a été trouvé.");
            } else {
                setError('Échec de l\'envoi du lien de réinitialisation du mot de passe. Veuillez réessayer.');
            }
        } else {
            setError('Échec de l\'envoi du lien de réinitialisation du mot de passe. Veuillez réessayer.');
        }
        setMessage('');
    } finally {
      setLoading(false)
    }
};


  return (
    <div className="password-reset-container">
                <img src={background_car} className="register_background up_background " alt="" />
    
        <div  className="form-container-register" id='resetcontain'>
        <img className='modal_img' src={mini_logo} style={{ width: "10%", height: "10%", marginBottom: "0px", opacity: '1' }} alt="logo" id='logo_mini' />
        <h1 className="title">Réinitialisez votre mot de passe</h1>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
      />
   
        {message && <p>{message}</p>}
        {error && <p className="error-message">{error}</p>}
        {showgoogle ? (
  <div className={Emailcontainer} id='mot_de_pass_su'>
    <h1 style={{ fontSize: "1rem" }}>Votre compte semble être un compte créé via Google Authentification. Vous pouvez y accéder directement avec votre compte Google.</h1>
    <GoogleOAuthProvider clientId="58202102051-2jc74gul47eg8j9kjtv47hsfhn9ddppv.apps.googleusercontent.com">
      <GoogleLoginComponent />
    </GoogleOAuthProvider>
    <h1 style={{ fontSize: "1rem" }}>Ou bien vous pouvez modifier votre mot de passe par le lien envoyé à votre boîte e-mail</h1>
  </div>
) : (
  <div className={Emailcontainer} id='mot_de_pass_su'>
    <i className="fas fa-envelope email-icon"></i>
    <h1>Un lien de réinitialisation a été envoyé à votre boîte e-mail.</h1>
  </div>
)}

        <form onSubmit={handleSubmit} className={RegisterForm}>
  

        <div className="input-container">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  placeholder="Entrez votre adresse e-mail"
                  value={email}
                  required
                  maxlength="40"
                  onChange={handleemailchange}
                  autoComplete="off"
                  name="email_field"
                />
                </div>
                <div className="account-controls">
                <button type="submit" disabled={loading}>
                {loading ? (
    <div className="spinner"></div>
  ) : (
    <>
      Suivant <i className="fas fa-solid fa-angle-right"></i>
    </>
  )}                </button>
              </div>
        </form>
  
      </div>
    </div>
  );
};

export default PasswordResetRequestForm;
