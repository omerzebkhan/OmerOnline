import React from 'react';
import { Link } from 'react-router-dom';

import Header from './header.component';
import BootstrapCarousel from './BootstrapCarousel';  
import CategoryCard from './CategoryCard.coponent';
import ListItem from './item-list.component';
import Footer from './footer.component';

const LandingPage = () => {
  return (
    <div className="jumbotron">
      <Header /> 

      <div>
        <BootstrapCarousel />  
        <CategoryCard />

        {/* Login Button
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Link to="/login" className="btn btn-primary btn-lg">
            Login
          </Link>
        </div> */}

        {/* Optional: placeholder for item list */}
        <div onClick={() => { console.log("calling item list"); }}>
          {/* {<ListItem />} */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
