import React from 'react'
import header from './header.jpg';
import { Image } from 'react-bootstrap';
//import {fetchSiteStartAsync} from '../redux/siteManagement/siteManagement.actions';
import 'bootstrap/dist/css/bootstrap.min.css'
const HeaderComponent = () => {
    return (
      
        <div class="jumbotron">
        <Image
        src={header}
        alt=""
        fluid 
        width="1500" 
        style={{'height':"200px"}} />
        </div>

    )
}

export default HeaderComponent;
