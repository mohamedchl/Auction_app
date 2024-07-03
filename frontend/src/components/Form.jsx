import { useState, useEffect } from "react";
import api from "../api";
import axios from 'axios';


import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

const MIN_SPEED = 1.5;
const MAX_SPEED = 2.5;

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

class Blob {
  constructor(el) {
    this.el = el;
    const boundingRect = this.el.getBoundingClientRect();
    this.size = boundingRect.width;
    this.initialX = randomNumber(0, window.innerWidth - this.size);
    this.initialY = randomNumber(0, window.innerHeight - this.size);
    this.el.style.top = `${this.initialY}px`;
    this.el.style.left = `${this.initialX}px`;
    this.vx = randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
    this.vy = randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
    this.x = this.initialX;
    this.y = this.initialY;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x >= window.innerWidth - this.size) {
      this.x = window.innerWidth - this.size;
      this.vx *= -1;
    }
    if (this.y >= window.innerHeight - this.size) {
      this.y = window.innerHeight - this.size;
      this.vy *= -1;
    }
    if (this.x <= 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.y <= 0) {
      this.y = 0;
      this.vy *= -1;
    }
  }

  move() {
    this.el.style.transform = `translate(${this.x - this.initialX}px, ${this.y - this.initialY}px)`;
  }
}

function initBlobs() {
  const blobEls = document.querySelectorAll('.bouncing-blob');
  const blobs = Array.from(blobEls).map((blobEl) => new Blob(blobEl));

  function update() {
    requestAnimationFrame(update);
    blobs.forEach((blob) => {
      blob.update();
      blob.move();
    });
  }

  requestAnimationFrame(update);
}

const Form = ({ route, method }) => {
  useEffect(() => {
    initBlobs();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    try {
 
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/`, { email, password });
      if (method === "login") {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
          navigate("/");
        } else {
          navigate("/login");
        }
    } catch (error) {
      alert(error)
      if (error.response && error.response.status === 401 && error.response.data.detail === 'User account is not active') {
        setErrorMessage(`Votre compte n'est toujours pas activé. Vous devez l'activer en utilisant le lien que nous avons envoyé à votre boîte email: ${email}`);
      } else {
        setErrorMessage('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="form-button" type="submit">
          {loading ? 'Loading...' : name}
        </button>
        {method === "login" && (
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>
            Go to Register
          </a>
        )}
      </form>
      <div className="bouncing-blobs-container">
        <div className="bouncing-blobs-glass"></div>
        <div className="bouncing-blobs">
          <div className="bouncing-blob bouncing-blob--blue"></div>
          <div className="bouncing-blob bouncing-blob--blue"></div>
          <div className="bouncing-blob bouncing-blob--blue"></div>
          <div className="bouncing-blob bouncing-blob--white"></div>
          <div className="bouncing-blob bouncing-blob--purple"></div>
          <div className="bouncing-blob bouncing-blob--purple"></div>
          <div className="bouncing-blob bouncing-blob--pink"></div>
        </div>
      </div>
    </div>
  );
}

export default Form;
