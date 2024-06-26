import React, { Component } from 'react'  
import Carousel from 'react-bootstrap/Carousel'  

export class BootstrapCarousel extends Component {  
        render() {  
                return (  
                        <div className="container"> 
                         <div class='container-fluid' >  
                          <div className="row title" style={{ marginBottom: "20px" }} >    
                         </div>  
                         </div>  
                         <div className='container-fluid' >  
                         <Carousel>  
                         <Carousel.Item style={{'height':"300px"}} >  
                         <img style={{'height':"300px"}}  
                         className="d-block w-100"  
                        src={'assets/img/c2.jpg'}
                        alt=""  />  
                           <Carousel.Caption>  
                             <h3>Buy</h3>  
                                 </Carousel.Caption>  
                                 </Carousel.Item  >  
                                 <Carousel.Item style={{'height':"300px"}}>  
                                 <img style={{'height':"300px"}}  
                                   className="d-block w-100"  
                                    src={'assets/img/c1.jpg'}
                                    alt=""/>  
                                       <Carousel.Caption>  
                                   
                                      </Carousel.Caption>  
                                         </Carousel.Item>  
                                       <Carousel.Item style={{'height':"300px"}}>  
                                       <img style={{'height':"300px"}}  
                                        className="d-block w-100"  
                                         src={'assets/img/c3.jpg'}
                                         alt=""   />  
                                        <Carousel.Caption>  
                                          <h3>Shop With Us</h3>  
                                          </Carousel.Caption>  
                                         </Carousel.Item>  
                                        </Carousel>  
                                </div>  
                        </div>  
                )  
        }  
}  
  
export default BootstrapCarousel  