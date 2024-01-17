import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';


import { fetchSaleByDate, fetchSaleByIdAsync, fetchSaleInvoiceDetailAsync } from '../../redux/Sale/sale.action';
import { fetchUserByInputAsync, fetchUserStartAsync } from '../../redux/user/user.action';
import { fetchItemStartAsync } from '../../redux/item/item.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

const SaleReturn = ({
    fetchItemStartAsync, itemData,
    fetchUserStartAsync, userData,
    fetchSaleByIdAsync,
    fetchSaleByDate, saleData,
    fetchSaleInvoiceDetailAsync, saleInvoiceDetailData,
    fetchUserByInputAsync, user,
    currentUser
}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [invoiceNo, setInvoiceNo] = useState("");
    const [message, setMessage] = useState("");
    // const [returnSale,setRetrunSale] = useState([])
    //const [content, setContent] = useState("");
    const [access, setAccess] = useState(false);

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

    const [filteredSale, setFilteredSale] = useState([]);
    const [selectFilteredSale, setSelectFilteredSale] = useState([]);


    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("SALE RETURN", currentUser.rights));
        console.log(`access value = ${access}`)
    }
        , []);

    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync])

    useEffect(() => {
        fetchUserStartAsync();
    }, [fetchUserStartAsync])

    useEffect(() => {
        setFilteredSale(saleData)
    }, [saleData])


    const handleChange = event => {
        console.log(`event id = ${event.target.id}
        event value = ${event.target.value}`);

        document.getElementById(event.target.id).value = event.target.value;
        if (event.target.id === "invoiceNo") {
            setInvoiceNo(event.target.value);
        }
        else if (event.target.id === "itemSearch") {

            console.log("Event value");
            console.log(event.target.value)
            //console.log()          
            setFilteredOptionsItem(itemData.filter(
                (option) => option.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
            ));
            setActiveOptionItem(0);
            setShowOptionsItem(true);
            //setItemInput(itemInput);
            setItemInput(event.target.value);
        }
        else if (event.target.id === "customerSearch") {
            // console.log(`customer input=${customerInput} ${event.target.value}`)
            if (userData.user) {
                setFilteredOptionsCustomer(userData.user.filter(
                    // console.log(userData[0].name)
                    (option) =>
                        option.name.toLowerCase().indexOf(customerInput.toLowerCase()) > -1 && option.roles.toUpperCase() === "CUSTOMER"
                    //option.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 && option.roles.toUpperCase() === "CUSTOMER"
                ));
                setActiveOptionCustomer(0);
                setShowOptionsCustomer(true);
                //setCustomerInput(customerInput);
                setCustomerInput(event.target.value);
            }
            else { setMessage(`No data for customer search...`) }
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
    const handleStartDTPicker = (date) => {
        setStartDate(date);
    }

    const handleEndDTPicker = (date) => {
        setEndDate(date);
    }


    const handleSubmit = event => {
        event.preventDefault();
        var cust = "0";
        var agent = "0";
        var item = "0";
        var inv = "0";

        if (cCustomer.length > 0) { cust = cCustomer[0].id }
        if (invoiceNo !== "") { inv = invoiceNo; }
        if (cAgent.length > 0) { agent = cAgent[0].id }
        if (cItem.length > 0) { item = cItem[0].id }
        fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), cust, agent, item, inv);
        console.log(saleData)

    }


    const returnHandler = event => {

        var saleReturn = [];
        //var returnQuantity = 0;
        var totalReturnValue = 0;
        var totalReturnCost = 0;
        var totalReturnProfit = 0;
        var totalReturnQuantity = 0;
        // var qty1=[];

        //        var batch = firestore.batch();
        var count = 0;
        console.log(saleInvoiceDetailData.length)
        saleInvoiceDetailData.map((item, index) => {
            if (document.getElementById(index).value !== '') {
                saleReturn.push([item.id, item.itemid, item.price, item.cost, item.saleInvoiceId, parseInt(document.getElementById(index).value), item.quantity]);
            }
        })
        console.log("Sale Return ")
        console.log(saleReturn)

        if (saleReturn.length === 0) { setMessage(`Select any value to return`) }
        else {
            saleReturn.map(async (item, index) => {

                count++;
                //console.log(`index value${document.getElementById(index)}`)
                // console.log(document.getElementById(index))
                // console.log(document.getElementById(index).value)



                totalReturnValue = totalReturnValue + (item[5] * item[2]);
                totalReturnCost = totalReturnCost + (item[5] * item[4]);
                // totalReturnProfit = totalReturnProfit + (document.getElementById(index).value * item.profit);
                totalReturnQuantity = parseInt(totalReturnQuantity) + parseInt(item[5]);
                console.log(` retrunQuantity = ${item[5]}
                totalReturnValue = ${totalReturnValue}
                totalReturnCost = ${totalReturnCost}
                totalReturnQuantity = ${totalReturnQuantity}
                         `)




                /////////////////////////////////////////////////////////////////////////////////
                ////////////////////Add values in the Sale Return table ////////////////////////
                /////////////////////////////////////////////////////////////////////////////////

                //1- create sale retun entry
                var vSaleReturn = ({
                    saleInvoiceId: item[4],
                    itemId: item[1],
                    quantity: item[5]
                });
                console.log(`return Sale values`);
                console.log(vSaleReturn);

                let asyncSaleReturn = await inventoryService.createSaleReturn(vSaleReturn)
                    .catch(e => {
                        console.log(`catch of Sale Return ${e} error from server  ${e.message}`)
                        setMessage(`catch of Sale Return ${e} error from server  ${e.message}`)
                    })
                console.log("Create Sale Successfully added....")

                /////////////////////////////////////////////////////////////////////////////////
                //////////////Update Sale deatils amount to reduce the quantity  ///////////////
                /////////////////////////////////////////////////////////////////////////////////
                var vSaleDetails = ({
                    quantity: parseInt(item[6]) - parseInt(item[5])
                });
                console.log(`sale Detail id = ${item[0]} itemqty = ${item[6]} - returnqty = ${item[5]}  quantity = ${vSaleDetails.quantity}`)

                if (vSaleDetails.quantity === 0) {
                    //delete sale detail
                    let resSaleDetail = await inventoryService.deleteSaleDetail(item[0])
                        .catch(e => {
                            console.log(`catch of Sale Return ${e} error from server  ${e.message}`)
                            setMessage(`catch of Sale Return ${e} error from server  ${e.message}`)
                        })
                    console.log("Delete Sale Detail ....")
                    console.log(resSaleDetail)
                }
                else {
                    let resUpdateSaleDetailQ = await inventoryService.updateSaleDetail(item[0], vSaleDetails)
                        .catch(e => {
                            console.log(`catch of Sale Return ${e} error from server  ${e.message}`)
                            setMessage(`catch of Sale Return ${e} error from server  ${e.message}`)
                        })
                    console.log(resUpdateSaleDetailQ)
                }


                /////////////////////////////////////////////////////////////////////////////////
                //////////////Update Item and Quantity Or showroom             //////////////////
                /////////////////////////////////////////////////////////////////////////////////


                let response2 = await itemService.get(item[1])
                    .catch(e => {
                        console.log(`catch of retriving item ${e} error from server  ${e.message}`)
                        setMessage(`catch of retriving item ${e} error from server  ${e.message}`)
                    })

                console.log(response2.data);
                const { id, quantity, showroom } = response2.data;

                console.log(`invoice quantity = ${parseInt(item[5])} `)
                // update quantity and showroom  of item
                var itemUpdated = {
                    quantity: parseInt(quantity) + parseInt(item[5]),
                    showroom: parseInt(showroom) + parseInt(item[5])
                }

                let response4 = await itemService.update(id, itemUpdated)
                    .catch(e => {
                        console.log(`catch of Update item ${e} error from server  ${e.message}`)
                        setMessage(`catch of Update item ${e} error from server  ${e.message}`);
                    })

                console.log(`item update response  =${response4}`)

                /////////////////////////////////////////////////////////////////////////////////
                //////////////Update sale Invoice             //////////////////
                /////////////////////////////////////////////////////////////////////////////////

                if (saleReturn.length === index + 1) {
                    console.log(`updating sale invoice.......`)
                    console.log(saleData)
                    console.log(selectFilteredSale)
                    var vSaleInvoice = {
                        Returned: parseInt(selectFilteredSale.Returned) + totalReturnValue,
                        invoicevalue: parseInt(selectFilteredSale.invoicevalue) - totalReturnValue,
                        Outstanding: parseInt(selectFilteredSale.Outstanding) - totalReturnValue,
                        totalitems: parseInt(selectFilteredSale.totalitems) - totalReturnQuantity
                    }
                    console.log(`Sale Invoice no =${selectFilteredSale.saleInvoiceId}
                                                                totalitems = ${vSaleInvoice.totalitems}
                                                                ${parseInt(selectFilteredSale.Returned)} + ${totalReturnValue}= ${vSaleInvoice.Returned}
                                                                ${parseInt(selectFilteredSale.Outstanding)} - ${totalReturnValue}=${vSaleInvoice.Outstanding}
                                                                ${parseInt(selectFilteredSale.invoicevalue)} - ${totalReturnValue}=${vSaleInvoice.invoicevalue}
                                                                `)
                    let res = await inventoryService.updateSale(selectFilteredSale.saleInvoiceId, vSaleInvoice)

                        .catch(e => {
                            console.log(`catch of Update Sale Invoice ${e} error from server  ${e.message}`)
                            setMessage(`catch of Update Sale Invoice ${e} error from server  ${e.message}`)
                        })
                    setMessage("Successfully Updated............")

                    // clear the profiles.
                    // To refreash the screen saleData value should be resetted to blank
                    //saleData
                    //Refesh the valus in the screen
                    //fetchSaleByIdAsync(invoiceNo);
                    var cust = "0";
                    var agent = "0";
                    var item = "0";
                    var inv = "0";

                    if (cCustomer.length > 0) { cust = cCustomer[0].id }
                    if (invoiceNo !== "") { inv = invoiceNo; }
                    if (cAgent.length > 0) { agent = cAgent[0].id }
                    if (cItem.length > 0) { item = cItem[0].id }
                    fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), cust, agent, item, inv);


                    fetchSaleInvoiceDetailAsync(invoiceNo);
                    saleInvoiceDetailData.map((item, index) => {
                        document.getElementById(index).value = ''

                    })


                }

                //                     ////////////////////////////////////////////////////////////////

            })

        }
    }



    const selectInvoice = (item) => {
        console.log("Select Invoice clicked");
        console.log(item.saleInvoiceId);

        console.log(`customer id = ${item.customerId}`)
        // const { fetchUserByInputAsync } = this.props;
        setInvoiceNo(item.saleInvoiceId);
        setSelectFilteredSale(item)
        fetchUserByInputAsync(item.customerId);
        fetchSaleInvoiceDetailAsync(item.saleInvoiceId);
    }


    //////////////////////////////////////////////////////////////////////
    /////////////////////////// Drop down logic for Item 
    const onKeyDownItem = (e) => {
        // console.log("On change is fired")
        // console.log(e.keyCode)
        // console.log(itemInput)
        // const { activeOption, filteredOptions } = this.props;
        if (e.keyCode === 13 && itemInput !== "")   //Enter key
        {
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

        // console.log(e.currentTarget.dataset.id);
        // console.log(itemData);
        const selectedItem = itemData.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        setItemInput(selectedItem[0].name);
        setcItem(selectedItem);
        // setPrice(selectedItem[0].showroomprice)


    };
    let optionListItem;
    if (showOptionsItem && itemInput) {
        // console.log(filteredOptionsItem);
        // console.log(filteredOptionsItem.length)
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

                                            <th style={{ width: "80%" }}>Name</th>
                                            <th>ShowRoom</th>
                                            <th>Cost</th>
                                            <th>ShowRoom Price</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{optionName.name}</td>
                                            <td>{optionName.showroom}</td>
                                            <td>{optionName.averageprice}</td>
                                            <td>{optionName.showroomprice}</td>
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

        // console.log(`selecte customer id = ${e.currentTarget.dataset.id}`);
        // console.log(`user data${userData.user[0].id}`);
        const selectedCustomer = userData.user.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );

        setCustomerInput(selectedCustomer[0].name);
        setcCustomer(selectedCustomer);

        // console.log(cItem[0].name)
    };
    let optionListCustomer;
    if (showOptionsCustomer && customerInput) {
        // console.log(filteredOptionsCustomer);
        // console.log(filteredOptionsCustomer.length)
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

        // console.log(e.currentTarget.dataset.id);
        // console.log(itemData);
        const selectedAgent = userData.user.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        setAgentInput(selectedAgent[0].name);
        setcAgent(selectedAgent);

        // console.log(cItem[0].name)
    };
    let optionListAgent;
    if (showOptionsAgent && agentInput) {
        // console.log(filteredOptionsAgent);
        // console.log(filteredOptionsAgent.length)
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
        <div className="container">
            {access ?
                <div>
                    <div >
                        <div className="searchFormHeader"><h1>Sale Return</h1></div>
                        {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

                        <div className="searchForm">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group row">
                                    <div className="col-sm-3">
                                        Start Date
                                        <DatePicker id="datePicker" selected={startDate} onChange={handleStartDTPicker}
                                            name="startDate" dateFormat="MM/dd/yyyy" />
                                    </div>
                                    <div className="col-sm-3">
                                        End Date
                                        <DatePicker id="datePicker" selected={endDate} onChange={handleEndDTPicker}
                                            name="startDate" dateFormat="MM/dd/yyyy" />
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
                                <div className="form-group row">
                                    <div className="col-sm-2">
                                        <label className="col-form-label" htmlFor="Item">Agent Name</label>
                                    </div>
                                    <div className="col-sm-2">
                                        <input
                                            type="text"
                                            name="agentSearch"
                                            id="agentSearch"
                                            placeholder="Select Agent"
                                            value={agentInput}
                                            onChange={handleChange}
                                            onKeyDown={onKeyDownAgent}
                                        />
                                    </div>

                                    <div className="col-sm-2">
                                        <input
                                            type="text"
                                            name="Agent"
                                            id="Agnet"
                                            placeholder="Select Agent"
                                            value={cAgent[0] ? cAgent[0].id : ""}
                                            disabled />
                                    </div>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            name="Agent Address"
                                            id="agentAddress"
                                            placeholder="Address"
                                            value={cAgent[0] ? cAgent[0].address : ""}
                                            disabled />
                                    </div>
                                    <div>
                                        {optionListAgent}
                                    </div>

                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-2">
                                        <label className="col-sm-2 col-form-label" htmlFor="Item" >Item </label>
                                    </div>
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
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            name="Item"
                                            id="Item"
                                            placeholder="ShowRoom Quantity"
                                            value={cItem[0] ? cItem[0].showroom : ""}
                                            disabled />
                                    </div>
                                    <div>
                                        {optionListItem}
                                    </div>
                                </div>


                                <div className="form-group row">
                                    <div className="col-sm-2">
                                        <label className="col-form-label" htmlFor="Item">Inovce No.</label>
                                    </div>
                                    <div className="col-sm-2">
                                        <input
                                            type="text"
                                            name="invoiceNo"
                                            id="invoiceNo"
                                            placeholder="InvoiceNo"
                                            value={invoiceNo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div >
                                    <button className="btn btn-success" type="submit" >Search</button>

                                </div>

                            </form>

                        </div>
                        {filteredSale ?
                            filteredSale.length > 0 ?
                                <div>
                                    <h3>Sale View</h3>
                                    <table border='1'>

                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Customer Name</th>
                                                <th>Agent Name</th>
                                                <th>Invoice Value</th>
                                                <th>Total Items</th>
                                                <th>Outstanding</th>
                                                <th>Date Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredSale.map((item, index) => (
                                                    console.log(item),
                                                    <tr key={index}
                                                        onClick={() => selectInvoice(item)}
                                                    >
                                                        <td>{item.saleInvoiceId}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.agentname}</td>
                                                        <td>{item.invoicevalue}</td>
                                                        <td>{item.totalitems}</td>
                                                        <td>{item.Outstanding}</td>
                                                        <td>{item.date}</td>

                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                :
                                "No Data Found"
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            saleInvoiceDetailData.map((item, index) => (
                                                //   console.log(item);
                                                <tr key={index}
                                                // onClick={() => this.selectInvoice(item)}
                                                >
                                                    <td>{item.id}</td>
                                                    <td>{item.createdAt}</td>
                                                    <td>{item.saleInvoiceId}</td>
                                                    <td>{item.itemname}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.costPrice}</td>
                                                    <td> <input
                                                        type="text"
                                                        name="Returned"
                                                        id={index}
                                                        placeholder="Return Qty"
                                                        onChange={handleChange} /></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <div className="col-sm-2">
                                    <button id="btnReturn" className="btn btn-primary" type="button" onClick={returnHandler}>Submit Return</button>
                                </div>
                            </div>
                            :
                            ""
                        }
                    </div>
                </div>
                :
                "Access denied for the screen"}
        </div>
    )
}



const mapStateToProps = state => ({
    user: state.user.users,
    currentUser: state.user.user.user,
    saleData: state.sale.sale,
    saleInvoiceDetailData: state.sale.saleInvoiceDetail,
    userData: state.user.users,
    itemData: state.item.items
})


const mapDispatchToProps = dispatch => ({
    fetchSaleByDate: (sDate, eDate, id, id1, itemId, invoiceId) => dispatch(fetchSaleByDate(sDate, eDate, id, id1, itemId, invoiceId)),
    fetchSaleInvoiceDetailAsync: (invoiceId) => dispatch(fetchSaleInvoiceDetailAsync(invoiceId)),
    fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync()),
    fetchUserStartAsync: () => dispatch(fetchUserStartAsync())


});

export default connect(mapStateToProps, mapDispatchToProps)(SaleReturn);