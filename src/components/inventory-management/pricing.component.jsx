import React,{useState,useEffect,useLayoutEffect} from 'react';
import { connect } from 'react-redux';

import {fetchItemStartAsync,setCurrentItem} from '../../redux/item/item.action';
import itemService from "../../services/item.services";
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';


const Pricing =({
    fetchItemStartAsync,
    itemData,
    setCurrentItem,
    currentItem,
    currentUser}) =>{
    
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedItem,setSelectedItem]=useState([]);
    const [userInput, setUserInput] = useState('');
    const [onlineprice,setOnlineprice]= useState('');
    const [showroomprice,setShowroomprice]=useState('');
    const [onlinediscount,setOnlinediscount]=useState('');
    const [cItem,setCItem]= useState('');
    const [access,setAccess] = useState(false);

    
    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
         setAccess(checkAccess("PRICING",currentUser.rights));
        // console.log(`access value = ${access}`)
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
            setOnlineprice(currentItem.onlineprice);
            setShowroomprice(currentItem.showroomprice);
            setOnlinediscount(currentItem.onlinediscount)
            setCItem(currentItem)
        }else{
            console.log("current stock is null")
        }
        
    }, [currentItem])

    const handleChange = event => {
        console.log("handle change is fired")
        //console.log(event);
      if(event.target.id === "onlineprice") {
          setOnlineprice(event.target.value);}
      else if(event.target.id === "showroomprice") {
            setShowroomprice(event.target.value);}
      else if(event.target.id === "onlinediscount") {
                setOnlinediscount(event.target.value);}    
      else if (event.target.id === "Name") {
        const userInput = event.currentTarget.value;
          if (event.currentTarget.value===""){
              console.log("value become null")
              setSelectedItem(itemData);
              setUserInput("")
          }
          else{
            const options = itemData;
            setSelectedItem( options.filter(
                (option) => option.itemName.toLowerCase().includes(userInput.toLowerCase())
          ))

            setFilteredOptions(filteredOptions);
            setUserInput(userInput);

        }}
    }

    const updatHandler =() =>{
        
            //update stock values
            // Get a new write batch
            console.log(`item id = ${cItem.id}`)
            var vItem = {
                onlineprice,
               showroomprice,
               onlinediscount
            }

            itemService.update(cItem.id,vItem)
            .then( res => {  
                console.log(`Item price updated..`)
            })
            .catch(e => {
                console.log(`catch of update Stock ${e}
            error from server  ${e.message}`);
            })
            
         
        }
    
    const handleSubmit = event => {
        setCItem(null);
    }
  
    return(
        <div>
        {access ?
        <div className="submit-form">
           
            <h1>Pricing</h1>
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
            <h1>Update Stock Price</h1>
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
                    <label className="col-sm-2 col-form-label" htmlFor="Name">Online Price</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            name="onlineprice"
                            id="onlineprice"
                            placeholder="onlineprice"
                            value={onlineprice}
                            onChange={handleChange}
                            />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label" htmlFor="Name">Showroom Price</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            name="showroomprice"
                            id="showroomprice"
                            placeholder="ShowRoom Price"
                            value={showroomprice}
                            onChange={handleChange}
                            />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label" htmlFor="Name">Online Discount</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            name="onlinediscount"
                            id="onlinediscount"
                            placeholder="Online Discount"
                            value={onlinediscount}
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
            <th>Online Price</th>
            <th>ShowRoom Price</th>
            <th>Online Discount</th>
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
          <td>{item.onlineprice}</td>
          <td>{item.showroomprice}</td>
          <td>{item.onlinediscount}</td>
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
    currentUser: state.user.user.user,
    currentItem:state.item.currentItem
})

const mapDispatchToProps = dispatch => ({
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync()),
    setCurrentItem: (id) => dispatch(setCurrentItem(id))  
    

});

export default connect(mapStateToProps, mapDispatchToProps)(Pricing);