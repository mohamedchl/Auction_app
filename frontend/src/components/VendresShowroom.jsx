import React from 'react';
import VendreCard from './VendreCard'; // Assuming you have a VendreCard component
import ex7 from '../assets/photos/Exemples/ex7.png';
import ex8 from '../assets/photos/Exemples/ex8.png';
import ex9 from '../assets/photos/Exemples/ex9.png';
import ex10 from '../assets/photos/Exemples/ex10.png';

function VendreShowroom() {
  // Dummy data for vendre showroom items
  const vendreShowroomItems = [
    { id: 1, image: ex7, description: 'description 1' },
    { id: 2, image: ex8, description: 'description 2' },
    { id: 3, image: ex9, description: 'description 3' },
    { id: 4, image: ex10, description: 'description 4' },
  ];

  return (
    <div>
      <h2>Les Auctions</h2>
      <div className="vendre-cards">
        {vendreShowroomItems.map((item) => (
          <VendreCard key={item.id} image={item.image} description={item.description} />
        ))}
      </div>
    </div>
  );
}

export default VendreShowroom;
