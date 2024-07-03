import React from 'react';
import MiniatureCard from './MiniatureCard'; // Assuming you have a MiniatureCard component
import exm1 from '../assets/photos/Exemples/exm1.png';
import exm2 from '../assets/photos/Exemples/exm2.png';
import exm3 from '../assets/photos/Exemples/exm3.png';

function Miniature() {
  // Dummy data for miniature items
  const miniatureItems = [
    { id: 1, image: exm1, description: 'Miniature item description 1' },
    { id: 2, image: exm2, description: 'Miniature item description 2' },
    { id: 3, image: exm3, description: 'Miniature item description 3' },
  ];

  return (
    <div>
      <h2>Miniature</h2>
      <div className="miniature-cards">
        {miniatureItems.map((item) => (
          <MiniatureCard key={item.id} image={item.image} description={item.description} />
        ))}
      </div>
    </div>
  );
}

export default Miniature;
