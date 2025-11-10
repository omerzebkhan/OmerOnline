import React, { useState, useEffect } from 'react';
//import { Bar, Line, Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap'

import { fetchCartStartAsync} from '../../redux/cart/cart.actions';

import DatePicker from "react-datepicker";

import cartService from '../../services/cart.services';

const ManageCart = ({fetchCartStartAsync,currentUser,setCurrentItem,cartData,isFetching,errorMessage,
    currentItem}) =>{
        const [currentCart,setCurrentCart] = useState([]);
        const [totalCartValue,setTotalCartValue] = useState(0);
        const [totalCartQty,setTotalCartQty] = useState(0);
        const [message,setMessage]= useState("");
        const history = useNavigate ();


        useEffect(() => {
            
            fetchCartStartAsync();
    
        }, [])

        
      return (
        <div>

<div className="searchFormHeader"><h1>Cart Management</h1></div>
                <div className="searchForm">
                    
                    {isFetching ? <div className="alert alert-warning" role="alert">loading....</div> : ''}
                    {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div> : ""}
                    {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}
                    {cartData ?
                        //    <BrandList brands={this.props.brandData} masterComp={this.props.masterComp}/>
                        //console.log(this.props.itemData)
                        <div>
                            <div>
                            <h3>Cart View</h3>
                            <table border='1'>

                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>User Id</th>
                                        <th>User Name</th>
                                        <th>Status</th>
                                        <th>Created At</th>                                      
                                    </tr>
                                </thead>

                                <tbody>


                                    {cartData ?
                                        cartData.map((item, index) => (
                                            //   console.log(item);

                                            <tr key={index} >                                             
                                                <td>{item.name}</td>
                                                <td> </td>
                                                <td>{item.onlineprice}</td>
                                                <td>{item.quantity*item.onlineprice}</td>
                                                <td><img src={`${import.meta.env.VITE_MIDDLEWARE}/itemsImages/${item.imageUrl}`} alt="no data" width="100" height="100" /></td>
                                               
                                                
                                            </tr>
                                        )
                                        )
                                        :
                                        "no data found"

                                    }
                                </tbody>
                            </table>
                            </div>
                           
                        </div>
                        :
                        ""}
                  
                  
                </div>
           
        </div>
    )
}

const mapStateToProps = state => ({
    cartData: state.cart.carts,
    isFetching: state.item.isFetching,
    errorMessage: state.item.errorMessage,
    currentUser: state.user.user.user
})

const mapDispatchToProps = dispatch => ({
    fetchCartStartAsync: () => dispatch(fetchCartStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageCart);
