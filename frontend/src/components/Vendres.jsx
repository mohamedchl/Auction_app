import React from 'react';
import VendreCard from './VendreCard'; // Assuming you have a VendreCard component
import ex4 from '../assets/photos/Exemples/ex4.png';
import ex5 from '../assets/photos/Exemples/ex5.png';
import ex6 from '../assets/photos/Exemples/ex6.png';
import ex7 from '../assets/photos/Exemples/ex7.png';

function Vendre() {
  // Dummy data for vendre items
  const vendreItems = [
    { id: 1, image: ex4, description: 'description 1' },
    { id: 2, image: ex5, description: 'description 2' },
    { id: 3, image: ex6, description: 'description 3' },
    { id: 4, image: ex7, description: 'description 4' },
  ];

  return (
    <div>
      <h2>Vendre</h2>
      <div className="vendre-cards">
        {vendreItems.map((item) => (
          <VendreCard key={item.id} image={item.image} description={item.description} />
        ))}
      </div>
    </div>
  );
}

export default Vendre;
