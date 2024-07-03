import React from 'react';
import '../styles/Footer.css'; // Import Footer.css for styling

function Footer() {
  return (
    
    <footer>
      <div className="footer-content">
        <div className="left-content">
          <p>This is a footer description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p className="copyright">© 2024 Ezayad. All rights reserved.</p>
        </div>
        <div className="right-content">
          <a href="#" className="contact-link"><i className="fas fa-phone-alt"></i> +1234567890</a>
          <a href="#" className="contact-link"><i className="fab fa-instagram"></i> Instagram</a>
          <a href="#" className="contact-link"><i className="far fa-envelope"></i> Email</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
