import React,{useState,useEffect} from 'react';
import { connect } from 'react-redux';

import { fetchCartDetailByCust} from '../../redux/cart/cart.actions';

import cartService from '../../services/cart.services';

const CartDetail = ({fetchCartDetailByCust,currentUser,setCurrentItem,cartData,isFetching,errorMessage,
    currentItem}) =>{
        const [currentCart,setCurrentCart] = useState([]);
        const [message,setMessage]= useState("");

        useEffect(() => {
            console.log(`currentUser id = ${currentUser.id}`)

            fetchCartDetailByCust(currentUser.id);
    
    
        }, [fetchCartDetailByCust])


        const btnAddQty = (item) => {
            console.log(item)
        }

        const btnRmvQty = (item) => {
            console.log(item)
        }

        const btnDeleteItem = (item) => {
          // event.preventDefault();
            console.log(`cart Delete item is clicked =${item.id}`);
            
                //if quantity of the cart id =1 then remove the update the cart as delete
                //update Cart Detail
                var data = {
                    status : "DELETE"    
                };
            
                cartService.updateCartDetail(item.cartid,data)
                .then(res =>{
                    setMessage("Your Cart has been updated")
                    fetchCartDetailByCust(currentUser.id);
                    
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
                            <h3>Cart View</h3>
                            <table border='1'>

                                <thead>
                                    <tr  >
                                        <th>Cart Id</th>
                                        <th>Item Name</th>
                                        <th>Item Description</th>
                                        <th>Quantity</th>
                                        <th>Creation Time</th>
                                        
                                        <th>Image</th>
                                    </tr>
                                </thead>

                                <tbody>


                                    {cartData ?
                                        cartData.map((item, index) => (
                                            //   console.log(item);

                                            <tr key={index} >
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td><button className="btn btn-primary" type="button" onClick={()=>{
                                                     btnAddQty(item)
                                                }}>+</button>
                                                {item.quantity}
                                                <button className="btn btn-primary" type="button" onClick={()=>{
                                                     btnRmvQty(item)
                                                }}>-</button></td>
                                                <td>{item.createdAt}</td>
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
