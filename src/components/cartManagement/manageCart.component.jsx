import React, { useState, useEffect } from 'react';
//import { Bar, Line, Pie } from 'react-chartjs-2';



import DatePicker from "react-datepicker";

import cartService from '../../services/cart.services';

const ManageCart = () => {

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
                            <h3>Carts</h3>
                            <table border='1'>

                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total Price</th>                                      
                                        <th>Image</th>
                                    </tr>
                                </thead>

                                <tbody>


                                    {cartData ?
                                        cartData.map((item, index) => (
                                            //   console.log(item);

                                            <tr key={index} >                                             
                                                <td>{item.name}</td>
                                                <td width="10%"><button className="btn btn-primary" type="button" onClick={()=>{
                                                     btnAddQty(item)
                                                }}>+</button>
                                                {item.quantity}
                                                <button className="btn btn-primary" type="button" onClick={()=>{
                                                     btnRmvQty(item)
                                                }}>-</button></td>
                                                <td>{item.onlineprice}</td>
                                                <td>{item.quantity*item.onlineprice}</td>
                                                <td><img src={`${process.env.REACT_APP_MIDDLEWARE}/itemsImages/${item.imageUrl}`} alt="no data" width="100" height="100" /></td>
                                                <button className="btn btn-primary deleteButton" type="button" onClick={()=>{
                                                    // setCurrentCart(item),
                                                    btnDeleteItem(item)
                                                }
                                                    }></button>
                                                
                                            </tr>
                                        )
                                        )
                                        :
                                        "no data found"

                                    }
                                </tbody>
                            </table>
                            </div>
                            <div>
                                Check Out 
                                <div>Sub Total ({totalCartQty} items ):RS {totalCartValue}</div>
                                <Button onClick={() => saveCart()}variant="primary" >Check Out</Button>    
                            </div>    
                        </div>
                        :
                        ""}
                  
                </div>
           
        </div>
    )
}



export default (ManageCart);
