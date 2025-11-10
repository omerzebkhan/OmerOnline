import React from 'react'
//import header from './header.jpg';
//import header from './${import.meta.env.VITE_HEADER_IMAGE}'
import { Image } from 'react-bootstrap';
//import {fetchSiteStartAsync} from '../redux/siteManagement/siteManagement.actions';
import 'bootstrap/dist/css/bootstrap.min.css'
const HeaderComponent = () => {
    //const headerImage = import(`assets/img/c2.jpg`);
    return (
      
        <div class="jumbotron">
        <Image
        src={`assets/header/${import.meta.env.VITE_HEADER_IMAGE}`}
        alt=""
        fluid 
        width="100%" 
        style={{'height':"200px"}} />
        </div>

    )
}

export default HeaderComponent;
