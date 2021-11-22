import React from 'react';

import Header from './header.component';
import BootstrapCarousel from './BootstrapCarousel';  
import CategoryCard from './CategoryCard.coponent';
import ListItem from './item-list.component';

const LandingPage =() =>{
 
    return(
        <div>
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
        </div>     
    )}

export default LandingPage;