import '../styles/Login_modal.css';
import mini_logo from '../assets/photos/mini_logo.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

import GoogleLoginComponent from './googlecompenment';

const CustomModal = ({ show, handleClose }) => {
  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, handleClose]);

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigatetoregiste = () => {
    navigate('/inscription');
  };

  const handleloginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/`, { email, password });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        window.location.reload();
      } else {
        alert('une Erreur');
      }
    } catch (error) {
      alert(error);
      if (error.response && error.response.status === 401 && error.response.data.detail === 'User account is not active') {
        setErrorMessage(`Votre compte n'est toujours pas activé. Vous devez l'activer en utilisant le lien que nous avons envoyé à votre boîte email: ${email}`);
      } else {
        setErrorMessage('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToResetPassword = (e) => {
    e.preventDefault();
    navigate('/reset-password');
  };

  return (
    <div className={`modal ${show ? 'show' : 'fade-out'}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={handleClose}>
          &times;
        </button>
        <img
          className="modal_img"
          src={mini_logo}
          style={{ width: '20%', height: '10%', marginBottom: '-20px' }}
          alt="logo"
          id="logo_mini"
        />
        <h4 className="modal_h4">Connectez</h4>
        <form className="modal_form" onSubmit={handleloginSubmit}>
          <div className="login__field">
            <i className="login__icon fas fa-user"></i>
            <input
              type="text"
              className="login__input"
              placeholder="User name / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login__field">
            <i className="login__icon fas fa-lock"></i>
            <input
              type="password"
              className="login__input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <input className="btn login" type="submit" value="Login" disabled={loading} />
          <div className="mot_de_passe_oublie_button">
            <p>
              Mot de passe oublié ?{' '}
              <a href="/" onClick={navigateToResetPassword}>
                Clickez ici
              </a>
            </p>
          </div>
        </form>

        <GoogleLoginComponent />
        <div className="creat_acnt_button">
          <p>
            Pas du compte ? <a onClick={navigatetoregiste}>Cree un compte</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
