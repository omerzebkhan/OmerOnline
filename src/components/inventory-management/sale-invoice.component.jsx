import React, { useState, useEffect,useLayoutEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { connect } from 'react-redux';

import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchUserStartAsync } from '../../redux/user/user.action';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";
import userService from "../../services/user.service";

const SaleInvoice = ({
    fetchItemStartAsync, itemData,
    fetchUserStartAsync, userData,
    currentUser
}) => {

    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [invoice, setInvoice] = useState("");
    const [btnItem, setBtnItem] = useState("Show");
    const [btnUser, setBtnUser] = useState("Show");
    const [invoiceItem, setInvoiceItem] = useState([]);
    const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
    const [totalInvoiceCost, setTotalInvoiceCost] = useState(0);
    const [totalInvoiceProfit, setTotalInvoiceProfit] = useState(0);
    const [totalInvoiceQuantity, setTotalInvoiceQuantity] = useState(0);
    const [qty, setQty] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [cItem, setcItem] = useState([]);
    const [itemInput, setItemInput] = useState("");
    const [activeOptionItem, setActiveOptionItem] = useState("");
    const [showOptionsItem, setShowOptionsItem] = useState(false);
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);

    const [cCustomer, setcCustomer] = useState([]);
    const [customerInput, setCustomerInput] = useState("");
    const [activeOptionCustomer, setActiveOptionCustomer] = useState("");
    const [showOptionsCustomer, setShowOptionsCustomer] = useState(false);
    const [filteredOptionsCustomer, setFilteredOptionsCustomer] = useState([]);


    const [cAgent, setcAgent] = useState([]);
    const [agentInput, setAgentInput] = useState("");
    const [activeOptionAgent, setActiveOptionAgent] = useState("");
    const [showOptionsAgent, setShowOptionsAgent] = useState(false);
    const [filteredOptionsAgent, setFilteredOptionsAgent] = useState([]);

    const [access, setAccess] = useState(false);



    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync])

   
    useEffect(() => {
        fetchUserStartAsync();
    }, [fetchUserStartAsync])

   useLayoutEffect(() => {
       // setMessage("");
        //checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("SALE INVOICE", currentUser.rights));
    }, []);

    const btnItemHandler = (event) => {
        event.preventDefault();
        //console.log("btnBrandHandler is clicked");
        if (event.target.attributes[0].nodeValue === "btnItem") {
            if (btnItem === "Show") {
                setBtnItem("Hide")
            } else {
                setBtnItem("Show")
            }
        }
        else if (event.target.attributes[0].nodeValue === "btnUser") {
            if (btnUser === "Show") {
                setBtnUser("Hide")
            } else {
                setBtnUser("Show")
            }


        }
    }

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "Quantity") {
            setQuantity(event.target.value);
        }
        else if (event.target.id === "Price") {
            setPrice(event.target.value);
        }
        else if (event.target.id === "Invoice") {
            setInvoice(event.target.value);
        }
        else if (event.target.id === "itemSearch") {
            //console.log(`itemdate =${itemData}`);            
            setFilteredOptionsItem(itemData.filter(
                (option) => option.name.toLowerCase().indexOf(itemInput.toLowerCase()) > -1
            ));
            setActiveOptionItem(0);
            setShowOptionsItem(true);
            //setItemInput(itemInput);
            setItemInput(event.target.value);
        }
        else if (event.target.id === "customerSearch") {
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
        else if (event.target.id === "agentSearch") {
            setFilteredOptionsAgent(userData.user.filter(
                (option) => option.name.toLowerCase().indexOf(agentInput.toLowerCase()) > -1
                    && option.roles.toUpperCase() === "SALEAGENT"
            ));
            setActiveOptionAgent(0);
            setShowOptionsAgent(true);
            //setCustomerInput(customerInput);
            setAgentInput(event.target.value);
        }
    }



    const handleSubmit = event => {
        event.preventDefault();
        //To check entered value should be less than showroom quantity
        if (cItem[0].showroom < parseInt(quantity)) {
            setMessage('Quantity is greated than Stock');
        }
        else {
            setInvoiceItem([...invoiceItem, [cItem[0].name, cItem[0].description, quantity, price, cItem[0].averageprice, (price * quantity) - (cItem[0].averageprice * quantity), cItem[0].id]]);
            var total = parseInt(price);
            var qty = parseInt(quantity);
            var cost = parseInt(cItem[0].averageprice);

            // console.log(`outside map total=${total} && qty=${qty}`);

            if (invoiceItem.length === 0) {
                console.log("no value in the invoice item")
                setTotalInvoiceValue(total * qty);
                setTotalInvoiceQuantity(parseInt(qty));
                setTotalInvoiceCost(parseInt(cost) * parseInt(qty));
                setTotalInvoiceProfit((price * quantity) - (cItem[0].averageprice * quantity));

            } else {

                setTotalInvoiceValue(parseInt(totalInvoiceValue) + (total * qty));
                setTotalInvoiceQuantity(parseInt(totalInvoiceQuantity) + qty);
                setTotalInvoiceCost(parseInt(totalInvoiceCost) + (cost * qty));
                setTotalInvoiceProfit(parseInt(totalInvoiceProfit) + (price * quantity) - (cItem[0].averageprice * quantity));

            }
        }


    }

    const removeItem = (item, index) => {
        //event.preventDefault();
        const temp = [...invoiceItem];
        temp.splice(index, 1);
        setInvoiceItem(temp);
        setTotalInvoiceValue(parseInt(totalInvoiceValue) - (parseInt(item[2] * parseInt(item[3]))));
        setTotalInvoiceQuantity(parseInt(totalInvoiceQuantity) - parseInt(item[2]));
        setTotalInvoiceCost(parseInt(totalInvoiceCost) - parseInt(item[2] * parseInt(item[4])));
        setTotalInvoiceProfit(parseInt(totalInvoiceProfit) - (parseInt(item[5])));
        setQuantity("");
        setPrice("");
        setInvoice("");
    }

    const saveSale = () => {

        var data = {
            reffInvoice: invoice,
            customerId: cCustomer[0].id,
            invoicevalue: totalInvoiceValue,
            totalitems: totalInvoiceQuantity,
            paid: 0,
            Returned: 0,
            Outstanding: totalInvoiceValue
        };

        inventoryService.createSale(data)
            .then(response => {

                console.log(`Sale successfully Added Invoice id = ${response.data.id}`);
                // if invoice is added get the invoceid and store in invoice detail
                // update vendor with the total sale and outstanding

                //////////////////////Update Vendor////////////////////////
                // 1- get total purchase & outstanding value of current vendor.
                // 2- update the purchase & outstanding with curenct invoice values.
                userService.get(cCustomer[0].id)
                    .then(resUser => {
                        // console.log(`supplier outstanding value = ${resUser.data.outstanding}
                        //              supplier total purchase value = ${resUser.data.totalamount}
                        // `);
                        var usrData = {
                            totalamount: parseInt(resUser.data.totalamount) + parseInt(totalInvoiceValue),
                            outstanding: parseInt(resUser.data.outstanding) + parseInt(totalInvoiceValue)
                        };
                        userService.update(cCustomer[0].id, usrData)
                            .then(resUpdateBalance => {
                                setMessage("User Balance updated");
                            })
                            .catch(e => {
                                setMessage(`catch of User Balance ${e} error from server  ${e.message}`)
                                console.log(`catch of User Balance ${e} error from server  ${e.message}`);
                            })

                    })
                    .catch(e => {
                        setMessage(`catch of Create Sale Invoice ${e} error from server  ${e.message}`)
                        console.log(`catch of Create Sale Invoice ${e} error from server  ${e.message}`);
                    })


                ///////////////////////////////////////////////////////

                //quantity: item[1],
                //saleprice: item[2],


                // loop throuhg invoice item 
                //1-create new sale detail 
                //2- get each item stock value and update stock value in the item table 

                invoiceItem.map((item) => {
                    var sDetailData = ({
                        saleInvoiceId: response.data.id,
                        // itemName: item[0],
                        itemName: item[6],
                        quantity: item[2],
                        price: item[3],
                        cost: item[4]
                        // profit should be calculated on run time


                    });

                    console.log(`sale invoice = ${sDetailData.saleInvoiceId}`)

                    inventoryService.createSaleDetail(sDetailData)
                        .then(response1 => {
                            setMessage("Sale Detail Entered");
                            console.log("Sale Detail Entered")
                            console.log(response1.data);
                            //Updating Item Stock
                            // get quantity and averageprice of an item
                            itemService.get(item[6])
                                .then(response2 => {
                                    console.log("get specific Item detail")
                                    console.log(response2.data);
                                    const { id, quantity, showroom } = response2.data;
                                    console.log(`item id = ${id}
                                    item Quantity = ${quantity}
                                    Item showroom = ${showroom}
                                    `);
                                    console.log(`invoice quantity = ${parseInt(item[2])} `)
                                    // update quantity and showroom  of item
                                    var itemUpdated = {
                                        quantity: parseInt(quantity) - parseInt(item[2]),
                                        showroom: parseInt(showroom) - parseInt(item[2])
                                    }
                                    itemService.update(id, itemUpdated)
                                        .then(response4 => {
                                            console.log(`response qty =${response4.data.quantity}
                                                response showroom = ${response4.data.showroom}`)
                                            setMessage(`Updated Stock value successfully`);
                                            setMessage(`Sale successfully Added Invoice id = ${response.data.id}`);
                                            //     //reset all state
                                            setQuantity("");
                                            setPrice("");
                                            setInvoice("");
                                            setBtnItem("Show");
                                            setInvoiceItem([]);
                                            setTotalInvoiceValue(0);
                                            setTotalInvoiceQuantity(0);
                                            setQty([]);
                                            setLoading(false);

                                        })
                                        .catch(e => {
                                            console.log(`catch of update Stock ${e}
                                        error from server  ${e.message}`);
                                        })
                                })
                                .catch(e => {
                                    console.log(`catch of specific item detail ${e}
                                        error from server  ${e.message}
                                        `);
                                })


                        })
                        .catch(e => {
                            setMessage(`catch of purchase detail ${e} error from server  ${e.message}`)
                            console.log(`catch of purchase detail ${e} error from server  ${e.message}`);
                        })

                })
            })
            .catch(e => {
                console.log(`catch of create purchase${e}`);
            });
    }


    const submitInvoceHandler = async () => {
        setLoading(true);
        saveSale();


    }

    //////////////////////////////////////////////////////////////////////
    /////////////////////////// Drop down logic for Item 
    const onKeyDownItem = (e) => {
        //console.log("On change is fired")
        // const { activeOption, filteredOptions } = this.props;
        if (e.keyCode === 13) {
            setActiveOptionItem(0);
            setShowOptionsItem(false);
            setItemInput(filteredOptionsItem[activeOptionItem]);
        } else if (e.keyCode === 38) {
            if (activeOptionItem === 0) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionItem(activeOptionItem - 1)
        } else if (e.keyCode === 40) {
            if (activeOptionItem - 1 === filteredOptionsItem.length) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionItem(activeOptionItem + 1)
        }
    };
    const onClickItem = (e) => {
        setActiveOptionItem(0);
        setFilteredOptionsItem([]);
        setShowOptionsItem(false);

        console.log(e.currentTarget.dataset.id);
        console.log(itemData);
        const selectedItem = itemData.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        setItemInput(selectedItem[0].name);
        setcItem(selectedItem);

        // console.log(cItem[0].name)
    };
    let optionListItem;
    if (showOptionsItem && itemInput) {
        console.log(filteredOptionsItem);
        console.log(filteredOptionsItem.length)
        if (filteredOptionsItem.length) {
            optionListItem = (
                <ul className="options">
                    {filteredOptionsItem.map((optionName, index) => {
                        let className;
                        if (index === activeOptionItem) {
                            className = 'option-active';
                        }
                        return (
                            <li key={optionName.id} className={className} data-id={optionName.id} onClick={onClickItem}>
                                <table border='1' id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                       
                                            <th style={{width: "50%"}}>Name</th>
                                            <th>Quantity</th>
                                            <th>Cost</th>
                                        
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <td>{optionName.name}</td>
                                        <td>{optionName.quantity}</td>
                                        <td>{optionName.averageprice}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            optionListItem = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }


    //////////////////////////////////////////////////////////////////////


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

    //////////////////////////////////////////////////////////////////////
    /////////////////////////// Drop down logic for Agent 
    const onKeyDownAgent = (e) => {
        //console.log("On change is fired")
        // const { activeOption, filteredOptions } = this.props;
        if (e.keyCode === 13) {
            setActiveOptionAgent(0);
            setShowOptionsAgent(false);
            setAgentInput(filteredOptionsAgent[activeOptionAgent]);
        } else if (e.keyCode === 38) {
            if (activeOptionAgent === 0) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionAgent(activeOptionAgent - 1)
        } else if (e.keyCode === 40) {
            if (activeOptionAgent - 1 === filteredOptionsAgent.length) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionAgent(activeOptionAgent + 1)
        }
    };
    const onClickAgent = (e) => {
        setActiveOptionAgent(0);
        setFilteredOptionsAgent([]);
        setShowOptionsAgent(false);

        console.log(e.currentTarget.dataset.id);
        console.log(itemData);
        const selectedAgent = userData.user.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        setAgentInput(selectedAgent[0].name);
        setcAgent(selectedAgent);

        // console.log(cItem[0].name)
    };
    let optionListAgent;
    if (showOptionsAgent && agentInput) {
        console.log(filteredOptionsAgent);
        console.log(filteredOptionsAgent.length)
        if (filteredOptionsAgent.length) {
            optionListAgent = (
                <ul className="options">
                    {filteredOptionsAgent.map((optionName, index) => {
                        let className;
                        if (index === activeOptionAgent) {
                            className = 'option-active';
                        }
                        return (
                            <li key={optionName.id} className={className} data-id={optionName.id} onClick={onClickAgent}>
                                <table border='1' id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th className="th-sm">Name</th>
                                            <th>Address</th>
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
            optionListAgent = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }


    //////////////////////////////////////////////////////////////////////

    return (
        <div>
            {access ?
                <div className="submit-form container" >

                    <h1>Sale Invoice</h1>
                    {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''}
                    {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}
                    <div>
                        <button className="btn btn-primary" type="button" onClick={btnItemHandler}>Clear All</button>
                    </div>


                    <form onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Customer Name</label>
                                <input
                                    type="text"
                                    name="customerSearch"
                                    id="customerSearch"
                                    placeholder="Select Customer"
                                    value={customerInput}
                                    onChange={handleChange}
                                    onKeyDown={onKeyDownCustomer}
                                />
                                {optionListCustomer}
                            </div>
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Customer Id</label>
                                <input
                                    type="text"
                                    name="Customer"
                                    id="Customer"
                                    placeholder="Select Customer"
                                    value={cCustomer[0] ?
                                        cCustomer[0].id
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>

                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Address</label>
                                <input
                                    type="text"
                                    name="Customer Address"
                                    id="customerAddress"
                                    placeholder="Address"
                                    value={cCustomer[0] ?
                                        cCustomer[0].address
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>

                        </div>
                        <div className="form-group row">
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Agent Name</label>
                                <input
                                    type="text"
                                    name="agentSearch"
                                    id="agentSearch"
                                    placeholder="Select Agent"
                                    value={agentInput}
                                    onChange={handleChange}
                                    onKeyDown={onKeyDownAgent}
                                />

                                {optionListAgent}
                            </div>
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Agent Id</label>
                                <input
                                    type="text"
                                    name="Agent"
                                    id="Agnet"
                                    placeholder="Select Agent"
                                    value={cAgent[0] ?
                                        cAgent[0].id
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Address</label>
                                <input
                                    type="text"
                                    name="Agent Address"
                                    id="agentAddress"
                                    placeholder="Address"
                                    value={cAgent[0] ?
                                        cAgent[0].address
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>

                        </div>

                        <div className="form-group row">
                            <div>
                                <label className="col-sm-2 col-form-label" htmlFor="Item" >Item </label>
                                <div className="col-sm-2">
                                    <input
                                        type="text"
                                        name="itemSearch"
                                        id="itemSearch"
                                        placeholder="Select Item"
                                        value={itemInput}
                                        onChange={handleChange}
                                        onKeyDown={onKeyDownItem}
                                    />
                                </div>
                                {optionListItem}
                            </div>

                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="ShowRoom Qty">ShowRoom Qty</label>
                                <input
                                    type="text"
                                    name="Item"
                                    id="Item"
                                    placeholder="ShowRoom Quantity"
                                    value={cItem[0] ?
                                        cItem[0].showroom
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Quanity" >Quantity</label>
                                <div >
                                    <input
                                        type="text"
                                        name="Quantity"
                                        id="Quantity"
                                        placeholder="Quantity"
                                        value={quantity}
                                        onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Price" >price</label>
                                <div >
                                    <input
                                        type="text"
                                        name="Price"
                                        id="Price"
                                        placeholder="Price"
                                        value={price}
                                        onChange={handleChange} />
                                </div>
                            </div>


                        </div>




                        <div className="form-group row">
                            <div className="col-sm-2">
                                Total Quantity= {totalInvoiceQuantity}
                            </div>
                            <div className="col-sm-3">
                                Total Price = {totalInvoiceValue}
                            </div>
                            <div className="col-sm-3">
                                Total Cost = {totalInvoiceCost}
                            </div>
                            <div className="col-sm-3">
                                Total Profit = {totalInvoiceProfit}
                            </div>
                            <div className="col-sm-1">
                                <button className="btn btn-primary" type="submit">Add Item</button>

                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" type="button" onClick={submitInvoceHandler}>Submit Invoice</button>
                        </div>

                        <div>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Item Code</th>
                                        <th>Description</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total Price</th>
                                        <th>Cost</th>
                                        <th>Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceItem.length > 0 ? (
                                        invoiceItem.map((item, index) => {
                                            //console.log(index)
                                            return (<tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item[0]}</td>
                                                <td>{item[1]}</td>
                                                <td>{item[2]}</td>
                                                <td>{item[3]}</td>
                                                <td>{(parseFloat(item[3]) * parseFloat(item[2])).toFixed(3)}</td>
                                                <td>{(parseFloat(item[4]) * parseFloat(item[2])).toFixed(3)}</td>
                                                <td>{((parseFloat(item[3]) * parseFloat(item[2])) - (parseFloat(item[4]) * parseFloat(item[2]))).toFixed(3)}</td>
                                                <td><button type="button" onClick={() => removeItem(item, index)}>Remove item</button></td>
                                            </tr>
                                            )
                                        })
                                    )
                                        :
                                        <tr >
                                            <td colSpan='8' align="center">Enter Item</td>
                                        </tr>}
                                </tbody>
                            </table>
                        </div>


                    </form>

                </div>
                :
                "Access denied for the screen"}
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync()),
    fetchUserStartAsync: () => dispatch(fetchUserStartAsync())

})

const mapStateToProps = state => ({
    itemData: state.item.items,
    userData: state.user.users,
    currentUser: state.user.user.user
})

export default connect(mapStateToProps, mapDispatchToProps)(SaleInvoice);