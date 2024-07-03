import React from 'react';
import Auctions from './Auctions';
import VendreShowroom from './VendresShowroom';
import Vendre from './Vendres';
import Miniature from './Miniatures';
import "../styles/Body.css";


function Body() {
  return (
<div className="body-container">
      <section>
        <Auctions />
      </section>
      <section>
        <VendreShowroom />
      </section>
      <section>
        <Vendre />
      </section>
      <section>
        <Miniature />
      </section>
    </div>
  );
}

export default Body;
