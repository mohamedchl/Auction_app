import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Assuming you are using axios for API calls
import api from "../api";
import GoogleLoginComponent from './googlecompenment';
import { GoogleOAuthProvider } from '@react-oauth/google';
import background_car from '../assets/photos/Exemples/car_background.png';
import "../styles/Register.css";
import mini_logo from '../assets/photos/mini_logo.png';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";


const RegisterForm = ({ method }) => {
    const [email, setEmail] = useState("");
    const [emaillogin, setEmailLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setconfirPassword] = useState("");

    const [loginpassword, setLoginPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [RegisterForm, setRegisterForm] = useState('register-container');
    const [Emailcontainer, setEmailcontainer] = useState('verify_email_present');
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [loading, setLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(true);
    const [logincontainer, setLoginContainer] = useState('form-register-start');
    const [registercontainer, setRegisterContainer] = useState('form-register-start');
    const [emailError, setEmailError] = useState('');
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirlpasswordError, setconfirmPasswordError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isconfirmPasswordVisible, setIsconfirmPasswordVisible] = useState(false);
    const [isloginPasswordVisible, setloginIsPasswordVisible] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {

       if (method === "Login"){
        setShowRegister(false);
        setRegisterContainer('form-register-start');
        setLoginContainer('form-container-log-logining');
       }else if(method === "Register"){
        setShowRegister(true)
        setRegisterContainer('form-container-register');
        setLoginContainer('form-container-log');
       }
  
 
    }, []);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/;
        return emailRegex.test(email);
    };

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z]+$/;
        return nameRegex.test(name);
    };

    const validatePassword = (password) => {
      if (password.length < 8) {
          return false;
      }
  
      const hasLetter = /[A-Za-z]/.test(password);
      const hasNumber = /\d/.test(password);
  
      return hasLetter && hasNumber;
  };
  
  
    const togglePasswordVisibility = (num) => {
     switch(num) { case 1 :setIsPasswordVisible(!isPasswordVisible); break;
      case 2 :setIsconfirmPasswordVisible(!isconfirmPasswordVisible); break;
      case 3 :setloginIsPasswordVisible(!isloginPasswordVisible); break ;
      default:setIsPasswordVisible(!isPasswordVisible); break;
     }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let isValid = true;

        // Reset errors
        setEmailError('');
        setFirstnameError('');
        setLastnameError('');
        setPasswordError('');
setconfirmPasswordError('')
        // Validate email format
        if (!validateEmail(email)) {
            setEmailError("Veuillez saisir une adresse e-mail valide de Gmail, Yahoo ou Hotmail.");
            isValid = false;
        }

        // Validate names
        if (!validateName(firstname)) {
            setFirstnameError('Le prénom ne doit pas contenir de caractères spéciaux.');
            isValid = false;
        }
        if (!validateName(lastname)) {
            setLastnameError('Le nom ne doit pas contenir de caractères spéciaux.');
            isValid = false;
        }

        // Validate password
        if (!validatePassword(password)) {
            setPasswordError('Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.');
            isValid = false;
        }
        if (password !== confirmpassword) {
          setconfirmPasswordError('Les deux mots de passe doivent être identiques.');
          isValid = false;
      }
        // Check for missing fields
        if (!email || !firstname || !lastname || !password || !confirmpassword) {
            if (!email) setEmailError('Veuillez remplir ce champ.');
            if (!firstname) setFirstnameError('Veuillez remplir ce champ.');
            if (!lastname) setLastnameError('Veuillez remplir ce champ.');
            if (!password) setPasswordError('Veuillez remplir ce champ.');
            if (!confirmpassword) setPasswordError('Veuillez remplir ce champ.');

            isValid = false;
        }

        if (!isValid) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register/`, {
                email,
                first_name: firstname,
                last_name: lastname,
                password
            });
            if (res.status === 201) {
                setRegisterForm("register-container-slideleft")
             setEmailcontainer("verify_email_sent")
            } else {
                alert("Erreur lors de l'inscription");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const data = error.response.data;
                if (data.email && data.email.includes("user account with this Email already exists.")) {
                    setEmailError('Cet e-mail est déjà utilisé.');
                } else if (data.email && data.email.includes("Failed to send verification email. The provided email address does not exist.")) {
                    alert('Échec de l\'envoi de l\'e-mail de vérification. L\'adresse e-mail fournie n\'existe pas.');
                } else {
                    alert('Une erreur est survenue lors de l\'inscription.');
                }
            } else {
                console.error('Erreur lors de la soumission du formulaire :', error);
                alert('Une erreur est survenue lors de l\'inscription.');
            }
        } finally {
            setLoading(false);
        }
        
        
        
    };

    const handleloginSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/`, { email : emaillogin, password : loginpassword });
          if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
            if (error.response && error.response.status === 401 && error.response.data.detail === 'User account is not active') {
                setErrorMessage(`Votre compte n'est toujours pas activé. Vous devez l'activer en utilisant le lien que nous avons envoyé à votre boîte email: ${emaillogin}`);
            } else {
                setErrorMessage('Login failed. Please check your credentials and try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    const handleemailchange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value === '') {
            setEmailError('');
        } 
    };
    const handleconfirmpasswordchange = (e) => {
      const value = e.target.value;
      setconfirPassword(value);
      if (value === '') {
          setconfirmPasswordError('');
      } else if (value !== password) {
setconfirmPasswordError('Les deux mots de passe doivent être identiques.')
      } else {
        setconfirmPasswordError('')
      }
  };
    const handleFirstnameChange = (e) => {
        const value = e.target.value;
        setFirstname(value);
        if (value === '') {
            setFirstnameError('');
        } else if (!validateName(value)) {
            setFirstnameError('Le prénom et le nom ne doit pas contenir de caractères spéciaux.');
        } else {
            setFirstnameError('');
        }
    };
    
    const handleLastnameChange = (e) => {
        const value = e.target.value;
        setLastname(value);
        if (value === '') {
            setLastnameError('');
        } else if (!validateName(value)) {
            setLastnameError('Le prénom et le nom ne doit pas contenir de caractères spéciaux.');
        } else {
            setLastnameError('');
        }
    };
    
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (confirmpassword !== value && confirmpassword !== '') {
          setconfirmPasswordError('Les deux mots de passe doivent être identiques.')
        }else {
          setconfirmPasswordError('');
        }
        if (value === '') {
            setPasswordError('');
        } else if (!validatePassword(value)) {
            setPasswordError('Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.');
        } else {
            setPasswordError('');
        }
    };
    const toggleProfileMenu = () => {
        if (showRegister) {
          setRegisterContainer('form-container-registerout');
          setLoginContainer('form-container-log-logining');
          setShowRegister(false);
        } else {
          setRegisterContainer('form-container-register');
          setLoginContainer('form-container-log-loginingout');
          setShowRegister(true);
        }
      };
      const navigateToResetPassword = (e) => {
        e.preventDefault();
        navigate('/reset-password');
      };
      return (
        <div className="all_container">
          <img src={background_car} className={`register_background ${showRegister ? 'up_background' : 'down_background'}`} alt="" />
          <div className={registercontainer}>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
            />
            <div className="inthemidlle">
            <img className='modal_img' src={mini_logo} style={{ width: "10%", height: "10%", marginBottom: "0px", opacity: '1' }} alt="logo" id='logo_mini' />
            <h1 className="title">Signup</h1>
            <p className="desc">
              'Create your account to upload or download pictures, videos, or music'
            </p>
            </div>
            <div className={Emailcontainer}>    <i class="fas fa-envelope email-icon"></i>
    <h1>Un Lien de verification a été envoyé a votre boite email.</h1>
 
    <p>Attention : vous ne pouvez pas accéder à votre compte si vous ne le vérifiez pas.</p></div>
            <form onSubmit={handleSubmit} className={RegisterForm} autoComplete="off">

              <div className="namescontainer">
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
                {emailError && <div className="error-message">{emailError}</div>}
              </div>
              <div className="namescontainer">
                <div className="nameinner">
                <div className="input-container">
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={firstname}
                    required
                    maxlength="30"
                    onChange={handleFirstnameChange}
                    autoComplete="off"
                    name="firstname_field"
                  />
                 
                </div>
                <div className="input-container">
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    placeholder="Nom"
                    value={lastname}
                    required
                    maxlength="30"
                    onChange={handleLastnameChange}
                    autoComplete="off"
                    name="lastname_field"
                  />
                
                </div>
                </div>

                {(firstnameError || lastnameError) && (
        <div className="error-message">{firstnameError ? firstnameError : lastnameError}</div>
    )}              </div>
                  <div className="namescontainer">

              <div className="input-container">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  required
                  maxlength="19"
                  autoComplete="new-password"
                  onChange={handlePasswordChange}
                  name="password_field"
                />
                   <div className="toggle-visibility" onClick={() => togglePasswordVisibility(1)}>
        <i className={isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
      </div>
                </div>
                {passwordError && <div className="error-message">{passwordError}</div>}
              </div>
              <div className="namescontainer">

<div className="input-container">
  <i className="fas fa-lock input-icon"></i>
  <input
    type={isconfirmPasswordVisible ? 'text' : 'password'}
    placeholder="Confirmer mot de pass"
    value={confirmpassword}
    required
    maxlength="20"
    autoComplete="off"
    onChange={handleconfirmpasswordchange}
    name="password_field"
  />
          <div className="toggle-visibility" onClick={() => togglePasswordVisibility(2)}>
          <i className={isconfirmPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
        </div>
  </div>
  {confirlpasswordError && <div className="error-message">{confirlpasswordError}</div>}
</div>
              
              <div className="account-controls">
                <button type="submit" disabled={loading}>
                  {loading ? 'Inscription...' : 'Suivant'} <i className="fas fa-solid fa-angle-right"></i>
                </button>
              </div>
            </form>
            <span className="line"></span>
            <span className="other-login-text">Ou Continue avec</span>
            <GoogleOAuthProvider clientId="58202102051-2jc74gul47eg8j9kjtv47hsfhn9ddppv.apps.googleusercontent.com">
              <GoogleLoginComponent />
            </GoogleOAuthProvider>
            <span className="signup-text">
              Already have an account?
              <a id="form-toggler" onClick={toggleProfileMenu}>
                {'Login here'}
              </a>
            </span>
          </div>
      
          <div className={logincontainer}>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
            />
            <img className='modal_img' src={mini_logo} style={{ width: "10%", height: "10%", marginBottom: "0px", opacity: '1' }} alt="logo" id='logo_mini' />
            <h1 className="title">Login</h1>
            <p className="desc">
              Login to your account
            </p>
            <form onSubmit={handleloginSubmit} className="register-container" autoComplete="off">
              <input type="text" style={{ display: 'none' }} />
              <input type="password" style={{ display: 'none' }} />
              <div className="input-container">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  placeholder="Email"
                  value={emaillogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  autoComplete="off"
                  name="emaillogin_field"
                />
              </div>
              <div className="input-container">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={isloginPasswordVisible ? 'text' : 'password'}
                  value={loginpassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="off"
                  name="loginpassword_field"
                />
                  <div className="toggle-visibility" onClick={() => togglePasswordVisibility(3)}>
        <i className={isloginPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
      </div>
              </div>
              <div className="forgetpasscntainer">
              <p>
              <a href="/" onClick={navigateToResetPassword}>
              Mot de passe oublié ?
              </a>
            </p>
            </div>
              <div className="account-controls">
                <button type="submit" disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </button>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
            <span className="line"></span>
            <span className="other-login-text">Or Login with</span>
            <GoogleOAuthProvider clientId="58202102051-2jc74gul47eg8j9kjtv47hsfhn9ddppv.apps.googleusercontent.com">
              <GoogleLoginComponent />
            </GoogleOAuthProvider>
            <span className="signup-text">
              Vous n'avez pas un compte?
              <a id="form-toggler" onClick={toggleProfileMenu}>{'Cree un compte'}</a>
            </span>
          </div>
        </div>
      );
};

export default RegisterForm;
