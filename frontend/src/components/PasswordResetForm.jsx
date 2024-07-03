import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/passwordReset.css";
import mini_logo from "../assets/photos/mini_logo.png";

const PasswordResetForm = () => {
  const { encoded_pk, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [ismodified, setIsmodified] = useState(false);
  const [isconfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [RegisterForm, setRegisterForm] = useState("register-container");
  const [messageClass, setMessageClass] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirlpasswordError, setconfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [Emailcontainer, setEmailcontainer] = useState("verify_email_present");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    let isValid = true;

    // Reset errors
    setPasswordError("");
    setconfirmPasswordError("");

    // Validate password
    if (!confirmpassword || !password) {
        if (!password) setPasswordError("Veuillez remplir ce champ.");
        if (!confirmpassword) setconfirmPasswordError("Veuillez remplir ce champ.");
        isValid = false;
    }
    if (!validatePassword(password)) {
        setPasswordError("Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.");
        isValid = false;
    }
    if (password !== confirmpassword) {
        setconfirmPasswordError("Les deux mots de passe doivent être identiques.");
        isValid = false;
    }
    if (!isValid) {
        setLoading(false);
        return;
    }

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/reset-password-page/`,
            {
                encoded_pk,
                token,
                password,
            }
        );

        if (response.data.message === "same_password") {
            setPasswordError("Le nouveau mot de passe ne peut pas être identique à l'ancien.");
        } else {
            setIsmodified(true);
            setRegisterForm("register-container-slideleft");
            setEmailcontainer("verify_email_sent");
        }
    } catch (error) {
      alert("Lien invalide ou expiré. Vous devez demander un autre")
        setRegisterForm("register-container-slideleft");
        setError("Failed to reset password. Please try again.");
        setEmailcontainer("verify_email_sent");
        setMessage("");
    } finally {
        setLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
        return false;
    }

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasLetter && hasNumber;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (confirmpassword !== value && confirmpassword !== "") {
        setconfirmPasswordError("Les deux mots de passe doivent être identiques.");
    } else {
        setconfirmPasswordError("");
    }
    if (value === "") {
        setPasswordError("");
    } else if (!validatePassword(value)) {
        setPasswordError("Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.");
    } else {
        setPasswordError("");
    }
  };

  const handleconfirmpasswordchange = (e) => {
    const value = e.target.value;
    setconfirPassword(value);
    if (value === "") {
        setconfirmPasswordError("");
    } else if (value !== password) {
        setconfirmPasswordError("Les deux mots de passe doivent être identiques.");
    } else {
        setconfirmPasswordError("");
    }
  };

  const togglePasswordVisibility = (num) => {
    switch (num) {
      case 1:
        setIsPasswordVisible(!isPasswordVisible);
        break;
      case 2:
        setIsConfirmPasswordVisible(!isconfirmPasswordVisible);
        break;
      default:
        setIsPasswordVisible(!isPasswordVisible);
        break;
    }
  };

  return (
    <div className="password-reset-container">
      <div className="form-container-register">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
        />
        <img
          className="modal_img"
          src={mini_logo}
          style={{
            width: "10%",
            height: "10%",
            marginBottom: "0px",
            opacity: "1",
          }}
          alt="logo"
          id="logo_mini"
        />
        <h1 className="title">Réinitialisez votre mot de passe</h1>
        <div className={Emailcontainer} id="mot_de_pass_succe">
          {ismodified ? <i className="fas fa-check-circle"></i> : <i className="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>}
          {ismodified ? <h1>Votre mot de passe a été modifié avec succès</h1> : <h1 style={{ color: "red" }}>Lien invalide ou expiré. Vous devez demander un autre</h1>}
        </div>
        <form onSubmit={handleSubmit} className={RegisterForm} autoComplete="off">
          <div className="namescontainer">
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Entrez votre nouveau mot de passe"
                value={password}
                required
                maxLength="19"
                autoComplete="new-password"
                onChange={handlePasswordChange}
                name="password_field"
              />
              <div
                className="toggle-visibility"
                onClick={() => togglePasswordVisibility(1)}
              >
                <i
                  className={
                    isPasswordVisible ? "fas fa-eye" : "fas fa-eye-slash"
                  }
                ></i>
              </div>
            </div>
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
          </div>
          <div className="namescontainer">
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={isconfirmPasswordVisible ? "text" : "password"}
                placeholder="Confirmer nouveau mot de passe"
                value={confirmpassword}
                required
                maxLength="20"
                autoComplete="off"
                onChange={handleconfirmpasswordchange}
                name="password_field"
              />
              <div
                className="toggle-visibility"
                onClick={() => togglePasswordVisibility(2)}
              >
                <i
                  className={
                    isconfirmPasswordVisible ? "fas fa-eye" : "fas fa-eye-slash"
                  }
                ></i>
              </div>
            </div>
            {confirlpasswordError && (
              <div className="error-message">{confirlpasswordError}</div>
            )}
          </div>
          <div className="account-controls">
            <button type="submit" disabled={loading}>
              {loading ? "modifion..." : "modifier"} <i className="fas fa-solid fa-angle-right"></i>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default PasswordResetForm;
