import React,{useState,useEffect} from 'react';
import { connect } from 'react-redux';
import { useNavigate  } from "react-router-dom";
import { Button } from 'react-bootstrap'

import { fetchCartDetailByCust} from '../../redux/cart/cart.actions';

import cartService from '../../services/cart.services';

const CartDetail = ({fetchCartDetailByCust,currentUser,setCurrentItem,cartData,isFetching,errorMessage,
    currentItem}) =>{
        const [currentCart,setCurrentCart] = useState([]);
        const [totalCartValue,setTotalCartValue] = useState(0);
        const [totalCartQty,setTotalCartQty] = useState(0);
        const [message,setMessage]= useState("");
        const history = useNavigate ();

        useEffect(() => {
            console.log(`currentUser id = ${currentUser.id}`)

            fetchCartDetailByCust(currentUser.id);
            
    
        }, [fetchCartDetailByCust])

        useEffect(() => {
            var totalCartValue = 0
            var totalCartQty =0
            console.log(cartData)
            if (cartData) {
                
                cartData.map((item, index) => {
                    totalCartQty = totalCartQty + item.quantity
                    totalCartValue = totalCartValue + (item.quantity*item.onlineprice)
                    setTotalCartValue(totalCartValue)
                    setTotalCartQty(totalCartQty)
                })
            }
           
            
        }, [cartData])
    
        const saveCart = () =>
        {
            //call update cart to "READY FOR DELIVERY"
           // console.log(cartData[0].id)
           var data1 = {
            status : "READY FOR DELIVERY"    
            };

            cartService.updateCart(cartData[0].id,data1)
            .then(res =>{
                setMessage("Your Cart has been Completed")
                ////////////////get item online price from the items table and update in the carts Details
                /////////////// and remove the quantity from the items table as item has been sold out.
                
                //////////////////////////////////////////////////////////////////////////////////////////

                

                setTotalCartValue(0)
                setTotalCartQty(0)
                fetchCartDetailByCust(currentUser.id);    
                
            })
            .catch((error) => {
                console.log(`error message=${error.response.request.response}`);
                //setProgress(0);
                setMessage(error.response.request.response.message);
            });  

        }

        const btnAddQty = (item) => {
            console.log(item)
            console.log(`cart + is clicked =${item.id}`)
            //update old cart quantity
              // then update stock value
              // PENDING item value should be check in the stock online to check availability
              console.log(`existing cart quantity should be update`)
              var data1 = {
                quantity: item.quantity + 1
              }

              cartService.updateCartDetail(item.cartid, data1).then(response => {
                setMessage(`Quantity udpated in the existing Cart`);
                console.log(response.data);
                // refresh the cart
                fetchCartDetailByCust(currentUser.id);
              })
              .catch(error => { if (error.response.status === 401) {
              history.push(`/login`)}
              console.log(`error from service cart = ${error.response.request.response.message}`);
            });

        }

        const btnRmvQty = (item) => {
            console.log(item)
            console.log(`cart - is clicked =${item.id}`)
            
            //update old cart quantity
              // then update stock value
              // PENDING quantity should be added back to the stock 
              console.log(`existing cart quantity should be update`)
              var data1 = {
                quantity: item.quantity - 1
              }
              
              if (data1.quantity>0){
              cartService.updateCartDetail(item.cartid, data1).then(response => {
                setMessage(`Quantity udpated in the existing Cart`);
                console.log(response.data);
                // refresh the cart
                fetchCartDetailByCust(currentUser.id);
              })
              .catch(error => { if (error.response.status === 401) {
              history.push(`/login`)}
              console.log(`error from service cart = ${error.response.request.response.message}`);
            });
        }
        else
        {
            //Qutantity become 0 so detlete the entry from the cartDetails
            // if there is no other value in the cart then update cart to deleted
            // PENDING item should be added back to the stock
            var data = {
                status : "DELETE"    
            };
        
            cartService.updateCartDetail(item.cartid,data)
            .then(res =>{
                setMessage("Your Cart Details has been updated")

                // check if there cart is empty then delete the cart
                // if total item was 1 then update cart as deleted 
                if (totalCartQty===1)
                {
                    var data1 = {
                        status : "DELETED"    
                    };

                    cartService.updateCart(item.id,data1)
                    .then(res =>{
                        setMessage("Your Cart has been updated")
                        setTotalCartValue(0)
                        setTotalCartQty(0)
                        fetchCartDetailByCust(currentUser.id);    
                        
                    })
                    .catch((error) => {
                        console.log(`error message=${error.response.request.response}`);
                        //setProgress(0);
                        setMessage(error.response.request.response.message);
                    });  

                }

                
                
            })
            .catch((error) => {
                console.log(`error message=${error.response.request.response}`);
                //setProgress(0);
                setMessage(error.response.request.response.message);
            });



        }

        }

        const btnDeleteItem = (item) => {
          // event.preventDefault();
            console.log(`cart Delete item is clicked =${item.id}`);
            
                //if quantity of the cart id =1 then remove the update the cart as delete
                // PENDING update the value of the item in the stock
                //update Cart Detail
                var data = {
                    status : "DELETE"    
                };
            
                cartService.updateCartDetail(item.cartid,data)
                .then(res =>{
                    setMessage("Your Cart has been updated")
                    // update the cart as deleted if there is no more items in cart
                    if (item.quantity === totalCartQty)
                    {
                        var data1 = {
                            status : "DELETED"    
                        };
    
                        cartService.updateCart(item.id,data1)
                        .then(res =>{
                            setMessage("Your Cart has been updated")
                            setTotalCartValue(0)
                            setTotalCartQty(0)
                            fetchCartDetailByCust(currentUser.id);    
                            
                        })
                        .catch((error) => {
                            console.log(`error message=${error.response.request.response}`);
                            //setProgress(0);
                            setMessage(error.response.request.response.message);
                        });  
    

                    }
                    else{
                        fetchCartDetailByCust(currentUser.id);
                    }
                    
                    
                })
                .catch((error) => {
                    console.log(`error message=${error.response.request.response}`);
                    //setProgress(0);
                    setMessage(error.response.request.response.message);
                });

        }

       
        return (
            <div>
                <div className="searchFormHeader"><h1>My Cart</h1></div>
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
                                                <td><img src={`${import.meta.env.VITE_MIDDLEWARE}/itemsImages/${item.imageUrl}`} alt="no data" width="100" height="100" /></td>
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


const mapStateToProps = state => ({
    cartData: state.cart.carts,
    isFetching: state.item.isFetching,
    errorMessage: state.item.errorMessage,
    currentUser: state.user.user.user
})

const mapDispatchToProps = dispatch => ({
    fetchCartDetailByCust: (id) => dispatch(fetchCartDetailByCust(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartDetail);
