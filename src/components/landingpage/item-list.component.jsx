import React, { useEffect, useState } from 'react';
import { connect, useSelector,useDispatch } from 'react-redux';
import { Card, Button } from 'react-bootstrap'
import { fetchItemByInputAsync } from '../../redux/item/item.action';
import { useHistory } from "react-router-dom";
import cartService from '../../services/cart.services';
import { fetchCartDetailByCust } from '../../redux/cart/cart.actions';
//import { logout } from "../../../  /src/redux/user/user.action";
import { logout } from "../../redux/user/user.action";

import Header from './header.component'

const ItemList = ({ fetchItemByInputAsync, itemData,
  currentCategory,
  fetchCartDetailByCust, cartData }) => {

  const history = useHistory();
  const currentUser = useSelector((state) => state.user.user.user);
  const refreshCat = localStorage.getItem("localCategory")
  const [message, setMessage] = useState("");
  const [itemInput, setItemInput] = useState("");
  const dispatch = useDispatch();
  const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);
  const [statusValue, setStatusValue] = useState();
    const [selectOptions,setSelectOptions]=useState();



  useEffect(() => {
    // console.log(`inside categoryId=${currentCategory}`);
    fetchItemByInputAsync(refreshCat);
  }, [fetchItemByInputAsync])
  //console.log(`categoryId=${categoryId}`);

  useEffect(() => {
    // console.log(`inside categoryId=${currentCategory}`);
    setFilteredOptionsItem(itemData);
  }, [itemData])

  useEffect(() => {
    const Status = [
        { value: "0", text: "Select" },
        { value: "1", text: "Active" },
        { value: "2", text: "DeActive" }
    ]
    setSelectOptions(Status.map((option) => {
        return <option value={option.value}>{option.text}</option>
    }))

}, [])

  const viewDetail = (item) => {
    console.log(`calling item Details `)
    history.push(`/ItemDetail`, { id: item })

  }
  const addToCart = (item) => {

    if (!currentUser) {
      console.log(`currentUser is null.......`)
      history.push(`/login`)
    }
    else {
      console.log(`Data entering in the cart......`)



      //add item to the user cart
      var data = {
        userid: currentUser.id,
        status: "INPROGRESS",
        itemid: item.id,
        quantity: 1,
        cartstatus: 'Add',
        cartid: '',
        price:item.onlineprice,
        cost:item.averageprice
      };

      console.log(data)
      //check for the user inprogress cart to decide create new one or add to existing one
      // if not create new one if exits then add item to it
      cartService.getCartDetailByCust(currentUser.id)
        .then(response1 => {

          if (response1.data.length === 0) {
            //cart is empty create a new cart
            console.log(`cart is empty`)
            // if not create new one if exits then add item to it
            // item stock value should be checked before creating the cart from online store
            // and stock should be updated after the cart will be created
            cartService.create(data)  //cart and cart details will be created by same api call.
              .then(response => {
                setMessage(`New Cart Created for the customer Cart Id = ${response.data.id}`);
                console.log(response.data);
              })
              .catch(error => {
                console.log(error)
                console.log(error.response.status)
                if (error.response.status === 401) {
                  //PENDING remove the user from the local cache by logging out
                  //
                  dispatch(logout());
                  history.push(`/login`)
                }

                console.log(`error from service cart = ${error.response.request.response.message}`);
              });



          }
          else {
            console.log(`cart already have values update cart`)
            // check if item is already available in the cart update the quantity

            data.cartid = response1.data[0].id;
            console.log(response1.data)
            // in case if item is not there in the cart add new entry in the cart details
            //compare item.id with array of reponse1.data if not found then add new entry if no then update the quantity
            const options = response1.data;
            var oldCartDetails = options.filter(
              (option) => option.itemid === item.id)
            console.log(`current cart same item checking ......`)
            console.log(oldCartDetails)

            if (oldCartDetails.length === 0) {
              //Create new cart Details
              cartService.createCartDetail(data)
                .then(response => {
                  setMessage(`Cart has been updated `);
                  // update the stock value of the online store
                })
                .catch(error => { if (error.response.status === 401) {history.push(`/login`)}
                console.log(`error No = ${error.response.status}`);
                  console.log(`error from service cart = ${error.response.request.response.message}`);
                });
            }
            else {
              //update old cart quantity
              // then update stock value
              // PENDING item value should be check in the stock online to check availability
              console.log(`existing cart quantity should be update`)
              var data1 = {
                quantity:   response1.data[0].quantity + 1
              }

              console.log(data1.quantity)
              console.log(oldCartDetails[0].cartid)
              cartService.updateCartDetail(oldCartDetails[0].cartid, data1).then(response => {
                setMessage(`Quantity udpated in the existing Cart`);
                console.log(response.data);
              })
              .catch(error => { if (error.response.status === 401) {history.push(`/login`)}
              console.log(`error from service cart = ${error.response.request.response.message}`);
            });
            }



          }




          //reserve the quantity from the online shop

        })
        .catch(error => {
          console.log(error)
          console.log(error.response.status)
          if (error.response.status === 401) {
            history.push(`/login`)
          }
          console.log(`error from service cart = ${error.response.request.response.message}`);
        });

    }
    //history.push(`/ItemDetail`,{id:item})

  }

  const handleChange = event => {
    //console.log(event);
    if (event.target.id === "Name") {
      setItemInput(event.target.value);

      if (event.target.value === "") {
        setFilteredOptionsItem(itemData);
      }
      else {
        setFilteredOptionsItem(itemData.filter(
          (option) => option.name.toLowerCase().indexOf(itemInput.toLowerCase()) > -1
        ));
      }
    }
  }


  return (

    <div>
      <Header />

      <div>
        {/* {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''} */}
        {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

        <div>
          {/* Selected Category :: {currentCategory} {refreshCat} */}
        </div>
        <div>
          <div className="row">
            {/* <div class="col-sm-2" style={{backgroundColor:"yellow"}}> */}
            <div className="col-sm-2">
              <div className="form-group">
                <label htmlFor="Name">Search Item</label>
                <input
                  type="text"
                  name="Name"
                  id="Name"
                  placeholder="Name"
                  value={itemInput}
                  onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="Name">Brand List</label>
                <div>
                                        <label>Status:</label>
                                        <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
                                            {selectOptions}
                                        </select>
                                    </div>
              </div>
            </div>
            <div className="col-sm-10" style={{ backgroundColor: "pink" }}>
              <div className="grid">
                {filteredOptionsItem ?
                  filteredOptionsItem.map((item, index) => {
                    if (item.online > 0)
                      return (<div key={index}>
                        <Card style={{ width: "18rem" }} className="box">
                          <Card.Img
                            variant="top"
                            className="card-img-top"
                            //src={`${process.env.REACT_APP_MIDDLEWARE}/itemsImages/${item.imageUrl}`}
                            src={process.env.REACT_APP_S3 === "True" ?
                              `${item.imageUrl}`
                              :
                              `${process.env.REACT_APP_MIDDLEWARE}/itemsImages/${item.imageUrl}`}
                            alt="no data"
                            width="100"
                            height="100" />
                          <Card.Body>

                            <Card.Title style={{ color: "green" }}>
                              {item.description}
                            </Card.Title>
                            <Card.Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                              {item.showroomprice}
                            </Card.Text>
                            <Card.Text className="text-primary">
                              {item.onlineprice} Rs
                            </Card.Text>
                            <Card.Text className="text-primary">
                              Quantity {item.online}
                            </Card.Text>
                            <Button onClick={() => addToCart(item)} variant="primary" >Add to Cart</Button><Button onClick={() => viewDetail(item)} className="btn btn-warning">Details</Button>

                          </Card.Body>
                        </Card>
                      </div>)


                  })
                  :
                  "No data found...."
                }
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  itemData: state.item.items,
  cartData: state.cart.carts,
  currentCategory: state.category.currentCategory
})

const mapDispatchToProps = dispatch => ({
  fetchItemByInputAsync: (categoryId) => dispatch(fetchItemByInputAsync(categoryId)),
  fetchCartDetailByCust: (id) => dispatch(fetchCartDetailByCust(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);

