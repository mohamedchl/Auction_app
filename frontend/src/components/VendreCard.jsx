import React from 'react';
import "../styles/VendreCard.css";

function VendreCard({ image, description }) {
  return (
    <div className="vendre-card">
      <img src={image} alt="Vendre item" />
      <div className="card-body">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default VendreCard;
