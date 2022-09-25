import React,{useState,useEffect,useLayoutEffect} from 'react';
import { connect } from 'react-redux';

//import {fetchStockStartAsync,setCurrentStock} from '../../redux/stock/stock.action';

import {fetchItemStartAsync,setCurrentItem} from '../../redux/item/item.action';
import itemService from "../../services/item.services";
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';

const MoveStock =({
    fetchItemStartAsync,
    itemData,
    setCurrentItem,
    currentItem,
    isFetching,
    currentUser1}) =>{
    
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedItem,setSelectedItem]=useState([]);
    const [userInput, setUserInput] = useState('');
    const [online,setOnline]= useState('');
    const [showroom,setShowroom]=useState('');
    const [warehouse,setWarehouse]=useState('');
    const [cItem,setCItem]= useState('');
    const [message,setMessage]= useState("");
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    const [access,setAccess] = useState("");

    useLayoutEffect(() => {
        checkAdmin()
        .then((r) => { setContent(r); });
        // checkAccess("MOVE STOCK",currentUser1.rights)
        // .then((r)=> {setAccess(r)})
        setAccess(checkAccess("MOVE STOCK",currentUser1.rights));
    }
        , []);

    useEffect(() => {
        setSelectedItem(itemData);
    },[itemData])

    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync])


    
    useEffect(() => {
        if (currentItem) {
            console.log(currentItem);
            setOnline(currentItem.online);
            setShowroom(currentItem.showroom);
            setWarehouse(currentItem.warehouse)
            setCItem(currentItem)
        }else{
            console.log("current stock is null")
        }
        
    }, [currentItem])

    const handleChange = event => {
        //console.log("handle change is fired")
        //console.log(event);
      if(event.target.id === "online") {
          setOnline(event.target.value);}
      else if(event.target.id === "showroom") {
            setShowroom(event.target.value);}
      else if(event.target.id === "warehouse") {
                setWarehouse(event.target.value);}    
      else if (event.target.id === "Name") {
        const userInput = event.currentTarget.value;
          if (event.currentTarget.value===""){
              //console.log("value become null")
              setSelectedItem(itemData);
              setUserInput("")
          }
          else{
            const options = itemData;
            setSelectedItem( options.filter(
                (option) => option.name.toLowerCase().includes(userInput.toLowerCase())
          ))

            setFilteredOptions(filteredOptions);
            setUserInput(userInput);

        }}
    }

    const updatHandler =() =>{
        if(currentItem.quantity !== parseInt(online)+parseInt(showroom)+parseInt(warehouse)){
            alert("values are wrong...");
        }
        else{
            setLoading(true);

            // Enter stock in move item table 
            var stockMovment = {
                itemId : cItem.id,
                online,
                showroom,
                warehouse
            };

            itemService.update(cItem.id,stockMovment)
            .then(result => {
                setMessage(`Stock Movement updated successfully`)
                //update stock values in the item table
                itemService.updateStockValue(cItem.id,stockMovment)
                .then(result1 =>{
                    setMessage(`Item Values updated successfully`)
                    setLoading(false);
                })
                .catch(e => {
                    console.log(`Error in catch of update stock value ${e}
                        error from server  ${e.message}
                        `)})
                
            })
            .catch(e => {
                console.log(`Error in catch of update stock movement ${e}
                    error from server  ${e.message}
                    `)})



            //update stock values in the item table
           // itemService.
            
            
            
            // Get a new write batch
            //console.log(cItem.id)
        //     var batch = firestore.batch();
        //     // Set the value of 'NYC'
        //     var nycRef = firestore.collection("Items").doc(cItem.id);
        //     batch.update(nycRef, {
        //         online,
        //         showroom,
        //         warehouse
        //     });

        //     // Commit the batch
        //     batch.commit().then(function () {
        //         
        //         console.log("Stock updated successfully")
        //         setMessage("Stock updated successfully");
        //         setCItem(null);  
        //         //console.log(currentItem)
        //         fetchItemStartAsync();
        //     });
         }
    }
    const handleSubmit = event => {
        setCItem(null);
    }
  
    return(
        <div>
        {access ?
        <div className="submit-form container">
             
            <h1>Move Items</h1>
            {loading ? <div className="alert alert-warning" role="alert">Processing....</div> : ''}
            {isFetching ? <div className="alert alert-warning" role="alert">Processing....</div> : ''}
            {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

            <form onSubmit={handleSubmit}>
            <div className="form-group">    
            <label htmlFor="Name">Name</label>
            <input
                    type="text"
                    name="Name"
                    id="Name"
                    value={userInput}
                    onChange={handleChange}
                    />
             </div>    
                <div >
                    <button className="btn btn-success" type="submit" >Search</button>
                </div>
            </form>
        {cItem ?
        <div>
            <h1>Update Stock Value</h1>
            <div className="form-group row">
                    <label className="col-sm-2 col-form-label" htmlFor="Name">ItemName</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            name="Name"
                            id="Name"
                            placeholder="Name"
                            value={cItem.name}
                            disabled />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label" htmlFor="Name">Quantity</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            name="Quantity"
                            id="Quantity"
                            placeholder="Bar code"
                            value={cItem.quantity}
                            disabled/>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label" htmlFor="Name">Online</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            name="online"
                            id="online"
                            placeholder="online"
                            value={online}
                            onChange={handleChange}
                            />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label" htmlFor="Name">ShowRoom</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            name="showroom"
                            id="showroom"
                            placeholder="ShowRoom"
                            value={showroom}
                            onChange={handleChange}
                            />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label" htmlFor="Name">Warehouse</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            name="warehouse"
                            id="warehouse"
                            placeholder="warehouse"
                            value={warehouse}
                            onChange={handleChange}
                            />
                    </div>
                </div>
                <div >
                    <button className="btn btn-success" type="button" onClick={updatHandler} >Update</button>

                </div>
            
        </div>
        :
        "Select Stock"
        }   
        {selectedItem ?
        //    <BrandList brands={this.props.brandData} masterComp={this.props.masterComp}/>
           //console.log(this.props.itemData)
        <div>
        <h3>Item View</h3>
        <table border='1'> 
        
          <thead>
            <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Online</th>
            <th>ShowRoom</th>
            <th>WareHouse</th>
            </tr>
            </thead>
          
            <tbody>

           
           {
        selectedItem.map((item,index) => (
         //   console.log(item);
        			 
         <tr key={index} 
          onClick={() => setCurrentItem(item)}
         >
          <td>{item.name}</td>
          <td>{item.quantity}</td>
          <td>{item.online}</td>
          <td>{item.showroom}</td>
          <td>{item.warehouse}</td>
         </tr>         
                    )
                )
            
            }
        </tbody>  
        </table>
        </div>
            :
            ""
           }
            </div>
             
          :
          "Access denied for the screen"}
          </div>
        )}


const mapStateToProps = state => ({
    itemData: state.item.items,
    currentItem:state.item.currentItem,
    isFetching :state.item.isFetching,
    currentUser1: state.user.user.user
})

const mapDispatchToProps = dispatch => ({
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync()),
    setCurrentItem: (id) => dispatch(setCurrentItem(id))  
    

});

export default connect(mapStateToProps, mapDispatchToProps)(MoveStock);