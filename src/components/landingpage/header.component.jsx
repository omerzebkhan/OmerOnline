

import header from './header.jpg';
import {Image} from 'react-bootstrap';
//import {fetchSiteStartAsync} from '../redux/siteManagement/siteManagement.actions';

const HeaderComponent=()=>{
    return(
     <div>

        <div>
       
        <Image
        src={header}
        alt=""
        fluid 
        width="1500" 
        style={{'height':"200px"}} />
       
        </div>  
     </div>
    )
}





export default HeaderComponent;
