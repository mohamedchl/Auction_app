import React from 'react';
import "../styles/MiniatureCard.css";

function MiniatureCard({ image, description }) {
  return (
    <div className="miniature-card">
      <img src={image} alt="Miniature item" />
      <div className="card-body">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default MiniatureCard;
