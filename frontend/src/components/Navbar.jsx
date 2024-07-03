import React, { useState, useEffect } from 'react';
import useIsAuthorized from './IsAuthorized';
import { useNavigate } from 'react-router-dom';
import "../styles/Home.css";
import "../styles/Login_modal.css";
import api from "../api";
import logo from '../assets/photos/logo-site.png';
import CustomModal from '../components/CustomModal';
import { GoogleOAuthProvider } from '@react-oauth/google';

function Navbar() {
  const isAuthorized = useIsAuthorized();
  const [name, setName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState(null);
  const [listItemsAnimation, setListItemsAnimation] = useState('list-items-enter');
  const [profile, setProfile] = useState(null);
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const getName = () => {
    api.get("/api/username/")
      .then((res) => res.data)
      .then((data) => {
        setName(data.username);
        console.log(data.username);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    if (isAuthorized !== null) {
      if (isAuthorized) {
        
      } else {
        setProfile(
          <button onClick={handleShow}>Connectez-vous</button>
        );
      }
    }
  }, [isAuthorized]);

  const toggleProfileMenu = () => {
    if (showProfileMenu) {
      setMenuAnimation('profile-menu-exit');
      setListItemsAnimation('list-items-enter');
      setShowProfileMenu(false);
    } else {
      setMenuAnimation('profile-menu-enter');
      setListItemsAnimation('list-items-exit');
      setShowProfileMenu(true);
    }
  };

  return (
    <div className='body'>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
      />
      <nav>
        <img src={logo} alt="logo" id='logo' />
        <ul className={listItemsAnimation}>
          <li><i style={{cursor:'pointer'}} className="fas fa-gavel"></i><p>Les enchaires</p></li>
          <li><i style={{cursor:'pointer'}} className="fas fa-car"></i><p>Vendre voiture</p></li>
          <li><i style={{cursor:'pointer'}} className="fas fa-th-list"></i><p>Les catégories</p></li>
          <div className={`searchInputWrapper`}>
            <input className="searchInput" type="text" placeholder='Chercher une voiture ?' />
            <i className="searchInputIcon fa fa-search"></i>
          </div>
          {isAuthorized && (
            <div className={`profilicon`} onClick={toggleProfileMenu}>
              <i className="fa-regular fa-circle-user"></i>
              {name}
            </div>
          )}
        </ul>
        {showProfileMenu && (
          <ul className={menuAnimation}>
            <li><p>Profil</p></li>
            <li><p>Déconnexion</p></li>
            <li><button onClick={toggleProfileMenu}>Retour</button></li>
          </ul>
        )}
        {!isAuthorized && profile}
      </nav>
      <div className="circles-container">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
      </div>
      <GoogleOAuthProvider clientId="58202102051-2jc74gul47eg8j9kjtv47hsfhn9ddppv.apps.googleusercontent.com">
        <CustomModal show={show} handleClose={handleClose} />
      </GoogleOAuthProvider>
    </div>
  );
}

export default Navbar;
