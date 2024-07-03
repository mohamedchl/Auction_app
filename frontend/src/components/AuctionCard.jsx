import React, { useState, useEffect } from 'react';
import '../styles/AuctionCard.css';

const AuctionCard= ({ slide, index, slideIndex }) => {
  return (
    <div className={`mySlides ${slideIndex === index ? 'animate' : ''}`} style={{ display: slideIndex === index ? 'block' : 'none' }}>
      <img src={slide.src} alt={`slide-${index}`} />
     
      <div className="text">{slide.text}</div>
    </div>
  );
};

export default AuctionCard;