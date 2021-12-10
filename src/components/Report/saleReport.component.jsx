import React,{useState,useEffect} from 'react';
import { connect } from 'react-redux';

import { fetchSaleByDate,fetchSaleInvoiceDetailAsync } from '../../redux/Sale/sale.action';
import { fetchUserByInputAsync,fetchUserStartAsync } from '../../redux/user/user.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import PdfInvoice from "./printInvoice"

const SaleReport = ({
    fetchUserStartAsync, userData,
    fetchSaleByDate,
    fetchSaleInvoiceDetailAsync,fetchUserByInputAsync,
    currentUser,
    saleData,saleInvoiceDetailData,user
}) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [invoice,setInvoice] = useState("");
    const [edit,setEdit] = useState("");

    const [sdId,setSDId] = useState("");
    const [sdItemName,setSDItemName]= useState("");
    const [sdPrice,setSDPrice] = useState("");
    const [sdQuantity,setSDQuantity] = useState("");

    const [sdOldId,setSDOldId] = useState("");
    const [sdOldItemName,setSDOldItemName]= useState("");
    const [sdOldPrice,setSDOldPrice] = useState("");
    const [sdOldQuantity,setSDOldQuantity] = useState("");

    const [cCustomer, setcCustomer] = useState([]);
    const [customerInput, setCustomerInput] = useState("");
    const [activeOptionCustomer, setActiveOptionCustomer] = useState("");
    const [showOptionsCustomer, setShowOptionsCustomer] = useState(false);
    const [filteredOptionsCustomer, setFilteredOptionsCustomer] = useState([]);
   
    useEffect(() => {
        fetchUserStartAsync();
    }, [fetchUserStartAsync])

    
    const handleStartDTPicker=(date) => {
      setStartDate(date);
      }

    const handleEndDTPicker=(date)=> {
        setEndDate(date);
      }
    
    const handleSubmit = event => {
        event.preventDefault();
        console.log(cCustomer.length)
        if (cCustomer.length>0)
        {
            fetchSaleByDate(startDate.toDateString(),endDate.toDateString(),cCustomer[0].id);    
        }
        else
        {
            fetchSaleByDate(startDate.toDateString(),endDate.toDateString(),"0");
        }
        
    }

    const selectInvoice = (item) => {
        console.log("Select Invoice clicked");
        console.log(item.id);
        console.log(`customer id = ${item.customerId}`)
        // const { fetchUserByInputAsync } = this.props;
        fetchUserByInputAsync(item.customerId);
        fetchSaleInvoiceDetailAsync(item.id);
    }

    const editInvoceHandler = (item) => {
       console.log('edit sale invoice.....')
       console.log(`invoice id =${item.id}`)
        setEdit("True");
        setSDOldId(item.id);
        setSDOldItemName(item.items.name);
        setSDOldPrice(item.price);
        setSDOldQuantity(item.quantity);

        setSDId(item.id);
        setSDItemName(item.items.name);
        setSDPrice(item.price);
        setSDQuantity(item.quantity);

    }

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "Quantity") {
            setSDQuantity(event.target.value);
        }
        elseif (event.target.id === "customerSearch") {
           console.log(`customer input=${customerInput} ${event.target.value}`)
           if(userData.user){
            setFilteredOptionsCustomer(userData.user.filter(
                // console.log(userData[0].name)
                (option) =>
                    option.name.toLowerCase().indexOf(customerInput.toLowerCase()) > -1 && option.roles.toUpperCase() === "CUSTOMER"
                   //option.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 && option.roles.toUpperCase() === "CUSTOMER"
            ));
            setActiveOptionCustomer(0);
            setShowOptionsCustomer(true);
            //setCustomerInput(customerInput);
            setCustomerInput(event.target.value);}
            else{setMessage(`No data for customer search...`)}
        }
     
    }


    //////////////////////////////////////////////////////////////////////
    /////////////////////////// Drop down logic for Customer 
    const onKeyDownCustomer = (e) => {
        //console.log("On change is fired")
        // const { activeOption, filteredOptions } = this.props;
        if (e.keyCode === 13) {
            setActiveOptionCustomer(0);
            setShowOptionsCustomer(false);
            setCustomerInput(filteredOptionsCustomer[activeOptionCustomer]);
        } else if (e.keyCode === 38) {
            if (activeOptionCustomer === 0) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionCustomer(activeOptionCustomer - 1)
        } else if (e.keyCode === 40) {
            if (activeOptionCustomer - 1 === filteredOptionsCustomer.length) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionCustomer(activeOptionCustomer + 1)
        }
    };
    const onClickCustomer = (e) => {
        setActiveOptionCustomer(0);
        setFilteredOptionsCustomer([]);
        setShowOptionsCustomer(false);

        console.log(`selecte customer id = ${e.currentTarget.dataset.id}`);
        console.log(`user data${userData.user[0].id}`);
        const selectedCustomer = userData.user.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        // const selectedCustomer = userData.filter(function (el) {
        //     console.log(el.id)
        //     return el.id == e.currentTarget.dataset.id ;
        //   });
        // console.log(`selected customer ${selectedCustomer.name}`);
        setCustomerInput(selectedCustomer[0].name);
        setcCustomer(selectedCustomer);

        // console.log(cItem[0].name)
    };
    let optionListCustomer;
    if (showOptionsCustomer && customerInput) {
        console.log(filteredOptionsCustomer);
        console.log(filteredOptionsCustomer.length)
        if (filteredOptionsCustomer.length) {
            optionListCustomer = (
                <ul className="options">
                    {filteredOptionsCustomer.map((optionName, index) => {
                        let className;
                        if (index === activeOptionCustomer) {
                            className = 'option-active';
                        }
                        return (
                            <li key={optionName.id} className={className} data-id={optionName.id} onClick={onClickCustomer}>
                                <table border='1' id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th className="th-sm">Name</th>
                                            <th>Addresss</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{optionName.name}</td>
                                            <td>{optionName.address}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            optionListCustomer = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }


    //////////////////////////////////////////////////////////////////////


  
        return (
            <div className="submit-form container">
                <h1>Sale Report</h1>
                <form onSubmit={handleSubmit}>
                <div className="form-group row">
                    <div className="col-sm-3">
                    Start Date    
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker
                      id = "datePicker" 
                      selected={startDate }
                      onChange={handleStartDTPicker }
                      name="startDate"
                      dateFormat="MM/dd/yyyy"
                    />
                    </div>
                    <div className="col-sm-3">
                    End Date    
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker
                      id = "datePicker" 
                      selected={ endDate }
                      onChange={ handleEndDTPicker }
                      name="startDate"
                      dateFormat="MM/dd/yyyy"
                    />
                    </div>
                    </div>

                    <div className="form-group row">
                   
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Customer Name</label>
                            </div>
                            <div className="col-sm-2">
                                <input
                                    type="text"
                                    name="customerSearch"
                                    id="customerSearch"
                                    placeholder="Select Customer"
                                    value={customerInput}
                                    onChange={handleChange}
                                    onKeyDown={onKeyDownCustomer}
                                />
                               
                            </div>
                            <div className="col-sm-2">
                                <input
                                    type="text"
                                    name="Customer"
                                    id="Customer"
                                    placeholder="Customer Id"
                                    value={cCustomer[0] ? cCustomer[0].id : ""}
                                    disabled />
                            </div>
                            <div className="col-sm-2">
                            <input
                                    type="text"
                                    name="Customer Address"
                                    id="customerAddress"
                                    placeholder="Address"
                                    value={cCustomer[0] ? cCustomer[0].address : ""}
                                    disabled />
                            </div>
                            {optionListCustomer}

                      
                    </div>
                    <div >
                        <button className="btn btn-success" type="submit" >Search</button>

                    </div>
                </form>

                { saleData ?
                    <div>
                        <h3>Sale View</h3>
                        <table border='1'>
                            <thead>
                                <tr>
                                    <th>Reff Invoice</th>
                                    <th>Total Items</th>
                                    <th>Invoice Value</th>
                                    <th>Date Time</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                saleData.map((item, index) => (
                                        //   console.log(item);
                                        <tr key={index}
                                        onClick={() => selectInvoice(item)}
                                        >
                                            <td>{item.id}</td>
                                            <td>{item.totalitems}</td>
                                            <td>{item.invoicevalue}</td>
                                            <td>{item.createdAt}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        </div>
           :
           ""
           }
        {saleInvoiceDetailData ?
                    <div>
                        <h3>Sale Invoice Detail View</h3>
                        <table id='returnTBL' border='1'>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Date</th>
                                    <th>Sale Id</th>
                                    <th>Item Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th> 
                                    <th>Cost</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    saleInvoiceDetailData.map((item, index) => (
                                        //   console.log(item);
                                        <tr key={index}
                                        onClick={() => editInvoceHandler(item)}
                                        >
                                            <td>{item.id}</td>
                                            <td>{item.createdAt}</td>
                                            <td>{item.saleInvoiceId}</td>
                                            <td>{item.items.name}</td>
                                            <td>{item.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.cost}</td>
                                            
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <PdfInvoice invoice={saleInvoiceDetailData} customer={user} />
        </div>
          
          :
          ""
      }
      {edit ==="True" ?
      <div className="form-group row">
      <div>    
      Sale Detail Id = {sdId} 
      </div>
      <div className="col-sm-2">
          <label className="col-sm-2 col-form-label" htmlFor="Item" >Item </label>
      </div>
          <div className="col-sm-2">
              <input
                  type="text"
                  name="itemSearch"
                  id="itemSearch"
                  placeholder="Select Item"
                  value={sdItemName}
                  onChange={handleChange}
                //   onKeyDown={onKeyDownItem}
              />
          
          {/* {optionListItem} */}
      </div>

      <div className="col-sm-4">
          
          <input
              type="text"
              name="Item"
              id="Item"
              placeholder="ShowRoom Quantity"
            //   value={cItem[0] ? cItem[0].showroom : ""}
              disabled />
      </div>
      <div className="form-group row">
      <div className="col-sm-2">
          <label className="col-sm-2 col-form-label" htmlFor="Item" >Quantity </label>
      </div>
      <div className="col-sm-4">
       <input
                  type="text"
                  name="Quantity"
                  id="Quantity"
                  placeholder="Quantity"
                  value={sdQuantity}
                  onChange={handleChange} />
          
      </div>
      </div>
      <div className="form-group row">
      <div className="col-sm-2">
          <label className="col-sm-2 col-form-label" htmlFor="Item" >Price </label>
      </div>
      <div className="col-sm-4">
          
              <input
                  type="text"
                  name="Price"
                  id="Price"
                  placeholder="Price"
                  value={sdPrice}
                  onChange={handleChange} />
          
      </div>
      <div>
                            <button className="btn btn-primary" type="button" onClick={editInvoceHandler}>Edit Invoice</button>
                        </div>
  

  </div>

  </div>

      :
      ""
      }
      </div>  
)}

const mapStateToProps = state => ({
                    user: state.user.users,
                    saleData: state.sale.sale,
                    saleInvoiceDetailData: state.sale.saleInvoiceDetail,
                    userData: state.user.users
})

const mapDispatchToProps = dispatch =>({
  fetchSaleByDate: (sDate,eDate,id) => dispatch(fetchSaleByDate(sDate,eDate,id)),
  fetchSaleInvoiceDetailAsync: (invoiceId) => dispatch(fetchSaleInvoiceDetailAsync(invoiceId)),  
  fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),
  fetchUserStartAsync: () => dispatch(fetchUserStartAsync())
  
});

export default connect(mapStateToProps,mapDispatchToProps)(SaleReport);
