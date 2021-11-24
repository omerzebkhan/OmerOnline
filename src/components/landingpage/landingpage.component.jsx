import React from 'react';

import Header from './header.component';
import BootstrapCarousel from './BootstrapCarousel';  
import CategoryCard from './CategoryCard.coponent';
import ListItem from './item-list.component';
import Footer from './footer.component';

const LandingPage =() =>{
 
    return(
        <div class="jumbotron">
          <Header /> 
        <div>
        <BootstrapCarousel></BootstrapCarousel>  
        <CategoryCard />
        <div onClick={()=>{
                //console.log("calling item list");
                <ListItem />
                }}>
        </div>
        
        </div>
        <Footer />
        </div>     
    )}

export default LandingPage;