import React, { useState, useEffect, useRef } from 'react';
import '../styles/AuctionCard.css';
import ex1 from '../assets/photos/Exemples/ex1.png';
import ex2 from '../assets/photos/Exemples/ex2.png';
import ex3 from '../assets/photos/Exemples/ex3.png';
import ex4 from '../assets/photos/Exemples/ex4.png';
import ex5 from '../assets/photos/Exemples/ex5.png';
import ex13 from '../assets/photos/Exemples/ex13.png';
import ex12 from '../assets/photos/Exemples/ex12.png';
import ex14 from '../assets/photos/Exemples/ex14.png';
import ex15 from '../assets/photos/Exemples/ex15.png';
import ex16 from '../assets/photos/Exemples/ex16.png';

const slidesData = [
  { id: 1, src: ex14, smallSrcTop: ex15, smallSrcBottom: ex16, title: 'Auction item description 1', price: '$100', date: 'Date: 01/01/2024' },
  { id: 2, src: ex2, smallSrcTop: ex13, smallSrcBottom: ex12, title: 'Auction item description 2', price: '$200', date: 'Date: 02/01/2024' },
  { id: 3, src: ex3, smallSrcTop: ex13, smallSrcBottom: ex12, title: 'Auction item description 3', price: '$300', date: 'Date: 03/01/2024' },
  { id: 4, src: ex1, smallSrcTop: ex13, smallSrcBottom: ex12, title: 'Auction item description 4', price: '$400', date: 'Date: 04/01/2024' },
  { id: 5, src: ex5, smallSrcTop: ex13, smallSrcBottom: ex12, title: 'Auction item description 5', price: '$500', date: 'Date: 05/01/2024' },
];

const Auctions = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const slideRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleNextSlide();
    }, 5000);
  };

  const handleNextSlide = () => {
    if (isSliding) return;
    setIsSliding(true);
    setSlideIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
    setTimeout(() => setIsSliding(false), 800);
    resetInterval();
  };

  const handlePrevSlide = () => {
    if (isSliding) return;
    setIsSliding(true);
    setSlideIndex((prevIndex) => (prevIndex - 1 + slidesData.length) % slidesData.length);
    setTimeout(() => setIsSliding(false), 800);
    resetInterval();
  };

  const handleCurrentSlide = (index) => {
    if (isSliding) return;
    setIsSliding(true);
    setSlideIndex(index);
    setTimeout(() => setIsSliding(false), 800);
    resetInterval();
  };

  return (
    <div>
      <div className="carousel-container">
        <div
          className="slide-track"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          ref={slideRef}
        >
          {slidesData.map((slide, index) => (
            <div key={index} className="mySlides">
              <div className="small-images-container">
                <img className="small-img" src={slide.smallSrcTop} alt={`Small Slide Top ${index}`} />
                <img className="small-img" src={slide.smallSrcBottom} alt={`Small Slide Bottom ${index}`} />
              </div>
              <img className="main-img" src={slide.src} alt={`Slide ${index}`} />
              <div className="titleee">{slide.title}</div>
              <div className="price">{slide.price}</div>
              <div className="date">{slide.date}</div>
            </div>
          ))}
        </div>
        <a className="prev" onClick={handlePrevSlide}>&#10094;</a>
        <a className="next" onClick={handleNextSlide}>&#10095;</a>
        <div className="dots-container">
          {slidesData.map((_, index) => (
            <span
              key={index}
              className={`dots ${slideIndex === index ? 'active' : ''}`}
              onClick={() => handleCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auctions;
