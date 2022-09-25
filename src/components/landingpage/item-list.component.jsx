import React, { useEffect,useState } from 'react';
import { connect,useSelector } from 'react-redux';
import { Card, Button } from 'react-bootstrap'
import { fetchItemByInputAsync } from '../../redux/item/item.action';
import {useHistory} from "react-router-dom";
import cartService from '../../services/cart.services';




import Header from './header.component';




const ItemList = ({ fetchItemByInputAsync, itemData, currentCategory }) => {

  const history = useHistory();
  const currentUser = useSelector((state) => state.user.user.user);
  const refreshCat = localStorage.getItem("localCategory")
  const [message, setMessage] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);

  

  useEffect(() => {
    // console.log(`inside categoryId=${currentCategory}`);
    fetchItemByInputAsync(refreshCat);
  }, [fetchItemByInputAsync])
  //console.log(`categoryId=${categoryId}`);

  useEffect(() => {
    // console.log(`inside categoryId=${currentCategory}`);
    setFilteredOptionsItem(itemData);
  }, [itemData])

  const viewDetail = (item)=>{
    console.log(`calling item Details `)
    history.push(`/ItemDetail`,{id:item})
   
  }
  const addToCart = (item)=>{
    
    if (!currentUser) {
      console.log(`currentUser is null.......`)
      history.push(`/login`)
    }
    else{
      console.log(`Data should be entered in the cart under the user`)
      //check for the user inprogress cart to decide create new one or add to existing one


      
      // if not create new one if exits then add item to it

      //add item to the user cart
      var data = {
        userid: currentUser.username,
        status: "InProgress",
        itemid: item.id,
        quantity:1,
        cartstatus:'Add'
    };

    console.log(data)

    cartService.create(data)
        .then(response => {
            setMessage(`New Cart Created for the customer Cart Id = ${response.data.id}`);
            console.log(response.data);
        })
        .catch(error => {
          console.log(error)
          console.log(error.response.status) 
          if (error.response.status===401){
            history.push(`/login`)
          }
          console.log(`error from service cart = ${error.response.request.response.message}`);
        });



      //reserve the quantity from the online shop

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
    }}


  return (

    <div>
      <Header />

      <div>
      {/* {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''} */}
      {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}
      
       <div>
         Selected Category :: {currentCategory} {refreshCat}
       </div>
       <div>
  <div class="row">
    {/* <div class="col-sm-2" style={{backgroundColor:"yellow"}}> */}
    <div class="col-sm-2">
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
    </div>
    <div class="col-sm-10" style={{backgroundColor:"pink"}}>
    <div className="grid">
          {filteredOptionsItem ?
            filteredOptionsItem.map((item, index) => {
              if (item.online >0)
              return (<div>
                <Card key={item.id} style={{ width: "18rem" }} className="box">
                <Card.Img
                  variant="top"
                  className="card-img-top"
                  //src={`${process.env.REACT_APP_MIDDLEWARE}/itemsImages/${item.imageUrl}`}
                  src ={ process.env.REACT_APP_S3 === "True" ?
                  `${item.imageUrl}`
                  :
                  `${process.env.REACT_APP_MIDDLEWARE}/itemsImages/${item.imageUrl}`}
                  alt="no data" 
                  width="100" 
                  height="100"/>
                <Card.Body>
                  <Card.Text>
                    <h5 class="fw-bold text-1000 text-truncate">{item.description}</h5>
                    <div class="fw-bold">
                      <span class="text-600 me-2 text-decoration-line-through">{item.showroomprice}</span>
                      <span class="text-primary">{item.onlineprice} Rs</span>
                    </div>
                    <div >
                      <span class="text-primary">Quantity {item.online}</span>
                    </div>
                  </Card.Text>
                  <Button onClick={()=>addToCart(item)} variant="primary" >Add to Cart</Button><Button onClick={()=>viewDetail(item)} className="btn btn-warning">Details</Button>

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
  currentCategory: state.category.currentCategory
})

const mapDispatchToProps = dispatch => ({
  fetchItemByInputAsync: (categoryId) => dispatch(fetchItemByInputAsync(categoryId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);

