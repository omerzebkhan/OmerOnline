import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

//import { fetchStockStartAsync } from '../../redux/stock/stock.action';
import { fetchItemStartAsync } from '../../redux/item/item.action';
import { setMessage } from '../../redux/user/user.action';
import itemService from "../../services/item.services";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const StockReport = ({
    fetchItemStartAsync, itemData,
    isFetching }) => {
    const [itemInput, setItemInput] = useState("");
    const [valueInput, setValueInput] = useState("");
    const [filter, setFilter] = useState("");
    const [data, setData] = useState("");
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);
    const [totalQuantity,setTotalQuantity] = useState([0]);
    const [totalRecord,setTotalRecord] = useState([0]);
    const [totalInventoryValue,setTotalInventoryValue] = useState([0]);
    const [itemPurchaseHistory,setItemPurchaseHistory] = useState([])
    const [itemSaleHistory,setItemSaleHistory] = useState([])
    const [itemReturnHistory,setItemReturnHistory] = useState([])

    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync])


    useEffect(() => {

        function sortById(a, b) {
            return a.id - b.id;
        }
        if (itemData) {
            const sorted = itemData.sort(sortById);
            setFilteredOptionsItem(sorted);
        }
    }, [itemData])


    useEffect(() => {
        var sumQuantity = 0
        var sumRecord = 1
        var sumInventoryValue = 0
        filteredOptionsItem.map((item, index) =>{
            sumQuantity = sumQuantity + item.quantity
            setTotalQuantity(sumQuantity)
            sumRecord = index + 1
            setTotalRecord(sumRecord)
            sumInventoryValue = sumInventoryValue + (item.quantity*item.averageprice)
            setTotalInventoryValue(parseFloat(sumInventoryValue).toFixed(3))
        })
    }, [filteredOptionsItem])

    const getPurchaseHistory = (itemId) =>{
        console.log(`item for the purchase history ${itemId}`)
        itemService.getItemPurchaseHistory(itemId)
        .then(response2 => {
     
            setItemPurchaseHistory(response2.data)
            
        })
        .catch(e => {
            console.log(`get Purchase History error ${e}`);
        })
     
    }

    const getSaleHistory = (itemId) =>{
        //console.log(`item for the purchase history ${itemId}`)
        itemService.getItemSaleHistory(itemId)
        .then(response2 => {
            //console.log(response2.data)
            setItemSaleHistory(response2.data)
        })
        .catch(e => {
            console.log(`get Sale History  error ${e}`);
        })
      //fetchPurInvPayDetial(invoiceId);
      // setPInvPayDetail(purInvDetail)

    }

    const getReturnHistory = (itemId) =>{
        //console.log(`item for the purchase history ${itemId}`)
        itemService.getItemReturnHistory(itemId)
        .then(response2 => {
            //console.log(response2.data)
            setItemReturnHistory(response2.data)
        })
        .catch(e => {
            console.log(`get Sale History  error ${e}`);
        })
      //fetchPurInvPayDetial(invoiceId);
      // setPInvPayDetail(purInvDetail)

    }


    const searchHandler = event => {
      
        if (filter === "Please Select")
        {setMessage("Select Filter")}
        else if (data === "Please Select")
        {setMessage("Select Data ")}
        else if ( valueInput === "")
        {setMessage("Select Data Value ")}
        else {
            //Put filter will 
            var selectedItem = [];
            if (filter === 'Equal To')
            {
                selectedItem = itemData.filter(
                    (option) => option[data] === parseFloat(valueInput) 
              );
            }
            else if (filter === 'Greater Than')
            {
                selectedItem = itemData.filter(
                    (option) => option[data] > parseFloat(valueInput) 
              );
            }
            else if (filter === 'Less Than')
            {
                selectedItem = itemData.filter(
                    (option) => option[data] < parseFloat(valueInput) 
              );
            }
           
            

            setFilteredOptionsItem(selectedItem)
        }
        
    }

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "Name") {
            setItemInput(event.target.value);
            if (event.target.value === "") {
                //sort item data based on id 
                function sortByDate(a, b) {
                    return parseInt(a.id) - parseInt(b.id);
                }
                const sorted = itemData.sort(sortByDate);
                setFilteredOptionsItem(sorted);
            }
            else {
                setFilteredOptionsItem(itemData.filter(
                    (option) => option.name.toLowerCase().indexOf(itemInput.toLowerCase()) > -1
                ));
            }
        }
        else if (event.target.id === "Filter") {
            setFilter(event.target.value);
        }
        else if (event.target.id === "Data") {
            setData(event.target.value);
        }
        else if (event.target.id === "Value") {
            setValueInput(event.target.value);
        }
    }


    return (
        <div className="submit-form container">

            <h1>Stock Report</h1>
            <form >
                <div className="form-group">
                    <label htmlFor="Name">Name</label>
                    <input
                        type="text"
                        name="Name"
                        id="Name"
                        placeholder="Name"
                        value={itemInput}
                        onChange={handleChange} />
                    Filter
                    <select id="Filter" name="Filter" onChange={handleChange}>
                        <option selected="Please Select">Please Select</option>
                        <option value="Equal To">Equal To</option>
                        <option value="Greater Than">Greater Than</option>
                        <option value="Less Than">Less Than</option>
                        </select>
                    Data
                    <select id="Data" name="Data" onChange={handleChange}>
                        <option selected="Please Select">Please Select</option>
                        <option value="averageprice">Average Cost</option>
                        <option value="quantity">Quantity</option>
                        <option value="online">Online Quantity</option>
                        <option value="showroom">Showroom Quantity</option>
                        <option value="warehouse">Warehouse Quantity</option>
                        <option value="onlineprice">Online Price</option>
                        <option value="showroomprice">Showroom Price</option>
                        <option value="onlinediscount">Online Discount</option>
                        </select>
                    <label htmlFor="Name">Value</label>
                    <input
                        type="text"
                        name="Value"
                        id="Value"
                        placeholder="Value"
                        value={valueInput}
                        onChange={handleChange} />
                    <button className="btn btn-primary" type="button" onClick={searchHandler}>Search</button>
                    <div>  
                                        <ReactHTMLTableToExcel  
                                                className="btn btn-info"  
                                                table="stockView"  
                                                filename="ReportExcel"  
                                                sheet="Sheet"  
                                                buttonText="Export excel" />  
                                </div>  
                </div>

            </form>
            {isFetching ?
                <div>"Loading data ....."</div> :
                ""}
                <div>
                 <div className="inputFormHeader"><h2>Summary</h2></div>
                    <div className="inputForm">
                    <div>Total Item Quantity = {totalQuantity}</div>
                    <div>Total Records = {totalRecord}</div>
                    <div>Inventory Value = {totalInventoryValue}</div>
                    </div>
                </div>
                
            {filteredOptionsItem ?
                <div>
                    <h3>Stock View</h3>
                    <table border='1' id="stockView">

                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Item Name</th>
                                <th>Average Cost</th>
                                <th>Quantity</th>
                                <th>Online Qty</th>
                                <th>Showroom Qty</th>
                                <th>Warehouse Qty</th>
                                <th>Online Price</th>
                                <th>Showroom Price</th>
                                <th>Online Discount</th>
                            </tr>
                        </thead>

                        <tbody>


                            {
                                filteredOptionsItem.map((item, index) => (
                                    //   console.log(item);

                                    <tr key={index}
                                    //onClick={() => setActiveBrand(item, index)}
                                    >
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.averageprice}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.online}</td>
                                        <td>{item.showroom}</td>
                                        <td>{item.warehouse}</td>
                                        <td>{item.onlineprice}</td>
                                        <td>{item.showroomprice}</td>
                                        <td>{item.onlinediscount}</td>
                                        <td><button type="button" onClick={() =>{
                                            getPurchaseHistory(item.id)
                                        }}>Purchase History</button></td>
                                    <td><button type="button" onClick={()=>{
                                        getSaleHistory(item.id)
                                        }}>Sale History </button></td>
                                     <td><button type="button" onClick={()=>{
                                        getReturnHistory(item.id)
                                        }}>Return History </button></td>    
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
            {itemPurchaseHistory ?
                <div>
                    <h3>Purchase History </h3>
                    <table border='1' id="Purchase History">

                        <thead>
                            <tr>
                                <th>Invoice Id</th>
                                <th>Supllier Name</th>
                                <th>Item Name</th>
                                <th>Inv. Deatil Id</th>
                                <th>Cost</th>
                                <th>Quantity</th>
                                <th>Creation Date Time</th>
                            </tr>
                        </thead>

                        <tbody>


                            {
                                itemPurchaseHistory.map((item, index) => (
                                    //   console.log(item);

                                    <tr key={index}
                                    //onClick={() => setActiveBrand(item, index)}
                                    >
                                        <td>{item.id}</td>
                                        <td>{item.supplierName}</td>
                                        <td>{item.itemName}</td>
                                        <td>{item.InvPurId}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.createdAt}</td>
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

{itemSaleHistory ?
                <div>
                    <h3>Sale History </h3>
                    <table border='1' id="Sale History">

                        <thead>
                            <tr>
                                <th>Invoice Id</th>
                                <th>Customer Name</th>
                                <th>Item Name</th>
                                <th>Inv. Deatil Id</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Creation Date Time</th>
                            </tr>
                        </thead>

                        <tbody>


                            {
                                itemSaleHistory.map((item, index) => (
                                    //   console.log(item);

                                    <tr key={index}
                                    //onClick={() => setActiveBrand(item, index)}
                                    >
                                        <td>{item.id}</td>
                                        <td>{item.customerName}</td>
                                        <td>{item.itemName}</td>
                                        <td>{item.InvPurId}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.createdAt}</td>
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
        {itemReturnHistory ?
                <div>
                    <h3>Return History </h3>
                    <table border='1' id="Return History">

                        <thead>
                            <tr>
                                <th>Sale Invoice Id</th>
                                <th>Return Id</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Creation Date Time</th>
                            </tr>
                        </thead>

                        <tbody>


                            {
                                itemReturnHistory.map((item, index) => (
                                    //   console.log(item);

                                    <tr key={index}
                                    //onClick={() => setActiveBrand(item, index)}
                                    >
                                        <td>{item.saleInvoiceId}</td>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.createdAt}</td>
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
    )
}


const mapStateToProps = state => ({
    itemData: state.item.items,
    isFetching: state.item.isFetching
})

const mapDispatchToProps = dispatch => ({
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(StockReport);
