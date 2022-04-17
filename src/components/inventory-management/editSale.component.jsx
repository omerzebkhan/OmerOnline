import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import inventoryService from "../../services/inventory.service";
import userService from "../../services/user.service";
import itemService from "../../services/item.services";
import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchSaleByDate, fetchSaleInvoiceDetailAsync } from '../../redux/Sale/sale.action';
import { fetchUserByInputAsync, fetchUserStartAsync } from '../../redux/user/user.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


const EditSale = ({
    fetchUserStartAsync, userData,
    fetchItemStartAsync, itemData,
    fetchSaleByDate,
    fetchSaleInvoiceDetailAsync, fetchUserByInputAsync,
    currentUser,
    saleData, saleInvoiceDetailData, user
}) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState("");
    const [edit, setEdit] = useState("");
    const [invoiceItem, setInvoiceItem] = useState([]);
    const [addItemBtn, setAddItemBtn] = useState(false);
    const [saleInvoice, setSaleInvoice] = useState("");

    const [sdId, setSDId] = useState("");
    const [sdItemName, setSDItemName] = useState("");
    const [sdPrice, setSDPrice] = useState("");
    const [sdQuantity, setSDQuantity] = useState("");

    const [sdOldId, setSDOldId] = useState("");
    const [sdOldItemName, setSDOldItemName] = useState("");
    const [sdOldPrice, setSDOldPrice] = useState("");
    const [sdOldQuantity, setSDOldQuantity] = useState("");
    const [sdCustomerId, setSDCustomerId] = useState("");
    const [sdItemId, setSDItemId] = useState("");
    const [sInvoiceId, setSInvoiceId] = useState("");

    const [cCustomer, setcCustomer] = useState([]);
    const [customerInput, setCustomerInput] = useState("");
    const [activeOptionCustomer, setActiveOptionCustomer] = useState("");
    const [showOptionsCustomer, setShowOptionsCustomer] = useState(false);
    const [filteredOptionsCustomer, setFilteredOptionsCustomer] = useState([]);

    const [cItem, setcItem] = useState([]);
    const [itemInput, setItemInput] = useState("");
    const [activeOptionItem, setActiveOptionItem] = useState("");
    const [showOptionsItem, setShowOptionsItem] = useState(false);
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);

    useEffect(() => {
        fetchUserStartAsync();
    }, [fetchUserStartAsync])

    useEffect(() => {
        ////// load current invoice detail in Invoice Item from saleInvoiceDetailData
        //setInvoiceItem([...invoiceItem, [cItem[0].name, cItem[0].description, quantity, price, cItem[0].averageprice, (price * quantity) - (cItem[0].averageprice * quantity), cItem[0].id]]);
        if (saleInvoiceDetailData) {
            var arr = [];
            console.log(saleInvoiceDetailData)
            saleInvoiceDetailData.map((i) => {
                console.log(i)
                //setInvoiceItem([...invoiceItem,[i.items.name,i.items.description,i.quantity,i.price,i.cost,i.cost *i.price,i.id]])
                arr.push([i.items.name, i.items.description, i.quantity, i.price, i.cost, (i.price * i.quantity) - (i.cost * i.quantity), i.itemId, i.id, i.saleInvoiceId]);
                //console.log(invoiceItem)
                //console.log(invoiceItem.length)
            })
            setInvoiceItem(arr);


        }
    }, [saleInvoiceDetailData])

    const handleStartDTPicker = (date) => {
        setStartDate(date);
    }

    const handleEndDTPicker = (date) => {
        setEndDate(date);
    }

    const handleSubmit = event => {
        event.preventDefault();
        console.log(cCustomer.length)
        if (cCustomer.length > 0) {
            fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), cCustomer[0].id);
        }
        else {
            fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), "0");
        }

    }

    const selectInvoice = (item) => {
        console.log("Select Invoice clicked");
        setSaleInvoice(item.saleInvoiceId);

        setSDCustomerId(item.customerId);
        fetchUserByInputAsync(item.customerId);
        fetchSaleInvoiceDetailAsync(item.saleInvoiceId);

    }

    const editInvoceHandler = (item) => {
        console.log('edit sale invoice.....')
        //console.log(`invoice id =${item.id}`)
        setEdit("True");
        console.log(item)

        setSDItemId(item[6]);
        setSInvoiceId(item[8])

        setSDOldId(item[7]);
        setSDOldItemName(item[0]);
        setSDOldPrice(item[3]);
        setSDOldQuantity(item[2]);

        setSDId(item[7]);
        setSDItemName(item[0]);
        setItemInput(item[0])
        setSDPrice(item[3]);
        setSDQuantity(item[2]);

    }

    const updateInvoceHandler = () => {
        console.log('edit sale invoice.....')
        if (sdId === "") {
            console.log(`new sale details should be added....${saleInvoice}`)
            setInvoiceItem([...invoiceItem, [cItem[0].name, cItem[0].description, sdQuantity, sdPrice, cItem[0].averageprice, (sdPrice * sdQuantity) - (cItem[0].averageprice * sdQuantity), cItem[0].id, '', saleInvoice]]);
        }
        else {
            ////////////////////////////////// update invoce detail
            var idData = { price: sdPrice, quantity: sdQuantity };

            inventoryService.updateSaleDetail(sdId, idData)
                .then(resUpdateBalance => {
                    setMessage("Sale Details updated .......");
                    console.log("Sale Details updated .......");

                    ////////////////////////////////////////////////////////////

                    ////////////////////////////////// update invoce Detail outstanding amount 
                    // call new service to recalculate the invoice value of given invoice no
                    inventoryService.getSaleRecalculate(sInvoiceId)
                        .then(res => {
                            setMessage("Sale Recalculated .......");
                            console.log(`Sale Recalculated .......`);
                        })
                        .catch(error => {
                            setMessage(`catch of Recalculated ${error.response.request.response.message}`)
                            console.log(`catch of Recalculated ${error.response.request.response.message}`);
                        })

                    //////////////////////calaulate the value diff between old and new value
                    //console.log(`sdoldprice = ${sdOldPrice}  sdprice = ${sdPrice}`)
                    var priceDiff = 0;
                    var quantityDiff = 0;
                    var amountDiff = 0;

                    priceDiff = sdOldPrice - sdPrice;

                    quantityDiff = sdOldQuantity - sdQuantity;


                    if (priceDiff !== 0 && quantityDiff !== 0) {
                        amountDiff = priceDiff * amountDiff;
                    }
                    else if (priceDiff === 0 && quantityDiff !== 0) {
                        amountDiff = sdOldPrice * quantityDiff;
                    }
                    else if (priceDiff !== 0 && quantityDiff === 0) {
                        amountDiff = priceDiff * sdOldQuantity;
                    }
                    console.log(`
                Price Diff = ${sdOldPrice} - ${sdPrice} =  ${priceDiff}
                Quanity Diff = ${sdOldQuantity} - ${sdQuantity} = ${quantityDiff} = ${quantityDiff}
                Amount Diff = ${amountDiff * -1}
                `)

                    ///////////////////////////update item value for the stock management
                    //                console.log(`sdoldQuantity = ${sdOldQuantity}  sdprice = ${sdQuantity}`)
                    //if (quantityDiff > 0) {
                        //get current customer values 
                        console.log(`item id = ${sdItemId}`)
                        itemService.get(sdItemId)
                            .then(res => {
                                var iData = {
                                    quantity: res.data.quantity + (quantityDiff),
                                    showroom: res.data.showroom + (quantityDiff)
                                }
                                console.log(`Item quantity & showroom are ${res.data.quantity} ${res.data.showroom} .......
                                 quantity update value = ${iData.quantity}
                                `);
                                itemService.update(sdItemId, iData)
                                    .then(res => {
                                        console.log(`Item data has been updated with ${iData.quantity} ${iData.showroom}`)
                                    })
                                    .catch(error => {
                                        setMessage(`catch of Item update ${error.response.request.response.message}`)
                                        console.log(`catch of Item update ${error.response.request.response.message}`);
                                    })
                            })
                            .catch(error => {
                                setMessage(`catch of Item ${error.response.request.response.message}`)
                                console.log(`catch of Item ${error.response.request.response.message}`);
                            })

                        // console.log(`update item quantity & showroom with current quantity - ${sdOldPrice - sdPrice} `)
                   // }

                    ////////////////////////////////////////////////////////////

                })
                .catch(error => {
                    setMessage(`catch of updateSaleDetail ${error.response.request.response.message}`)
                    console.log(`catch of updateSaleDetail ${error.response.request.response.message}`);
                })

        }
    }

    const deleteRecordHandler = () => {
        console.log(`item to remove ${sdItemId} quantity = ${sdOldQuantity}
        saleDetail invoice id = ${sdId}
        sale invoice = ${sInvoiceId}`);
        //search the item and update the quantity in the items table
        // get quantity and showroom of an item
        itemService.get(sdItemId)
            .then(response2 => {
                console.log("get specific Item detail")
                console.log(response2.data);
                const { id, quantity, showroom } = response2.data;
                // update quantity and showroom  of item
                console.log(`before qauntity = ${quantity} showroom=${showroom}`)
                var itemUpdated = {
                    quantity: parseInt(quantity) + parseInt(sdOldQuantity),
                    showroom: parseInt(showroom) + parseInt(sdOldQuantity)
                }
                console.log(`after qauntity = ${itemUpdated.quantity} showroom=${itemUpdated.showroom}`)
                itemService.update(id, itemUpdated)
                    .then(response4 => {
                        setMessage(`Updated Stock value successfully`);


                        //Delete the saleDetail Invoice
                        inventoryService.deleteSaleDetail(sdId)
                            .then(response2 => {
                                console.log(`sale details has been removed of ${sdId}`)

                                ////////////////////////////////// update invoce Detail outstanding,tatalitem,invoice value 
                                // call new service to recalculate the invoice value of given invoice no
                                inventoryService.getSaleRecalculate(sInvoiceId)
                                    .then(res => {
                                        setMessage("Sale Recalculated .......");
                                        console.log(`Sale Recalculated .......${sInvoiceId}`);
                                    })
                                    .catch(error => {
                                        setMessage(`catch of Recalculated ${error.response.request.response.message}`)
                                        console.log(`catch of Recalculated ${error.response.request.response.message}`);
                                    })
                                ////////////////////////////////////////////////////////////////



                            })
                            .catch(e => {
                                console.log(`catch of update Stock ${e}`);
                            })
                    })
                    .catch(e => {
                        console.log(`catch of update Stock ${e}`);
                    })
            })
    }

    const addItemHandler = () => {

        /////clear all text boxes
        setSDId("");
        setSDItemName("");
        setSDPrice("");
        setSDQuantity("");
        setItemInput("")

        setEdit("True");

        fetchItemStartAsync();
        setAddItemBtn(true);
    }

    const submitInvoiceHandler = () => {
        //add logic of submit sale invoice for new values only
        console.log(`Submit Invoice Handler is called ......`)
        invoiceItem.map((item) => {
            //console.log(item[7])
            if (!item[7]) {
                var sDetailData = ({
                    saleInvoiceId: item[8],
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

                        ////////////////////////////////// update invoce Detail outstanding,tatalitem,invoice value 
                        // call new service to recalculate the invoice value of given invoice no
                        inventoryService.getSaleRecalculate(sDetailData.saleInvoiceId)
                            .then(res => {
                                setMessage("Sale Recalculated .......");
                                console.log(`Sale Recalculated .......`);
                            })
                            .catch(error => {
                                setMessage(`catch of Recalculated ${error.response.request.response.message}`)
                                console.log(`catch of Recalculated ${error.response.request.response.message}`);
                            })
                        ////////////////////////////////////////////////////////////////


                        //Updating Item Stock
                        // get quantity and averageprice of an item
                        itemService.get(item[6])
                            .then(response2 => {
                                console.log("get specific Item detail")
                                console.log(response2.data);
                                const { id, quantity, showroom, averagePrice } = response2.data;
                                // console.log(`item id = ${id}
                                // item Quantity = ${quantity}
                                // Item showroom = ${showroom}
                                // Item averagePrice = ${averagePrice}
                                // `);
                                console.log(`invoice quantity = ${parseInt(item[2])} `)
                                // update quantity and showroom  of item
                                var itemUpdated = {
                                    quantity: parseInt(quantity) - parseInt(item[2]),
                                    showroom: parseInt(showroom) - parseInt(item[2])
                                }
                                itemService.update(id, itemUpdated)
                                    .then(response4 => {setMessage(`Updated Stock value successfully`); })
                                    .catch(e => {console.log(`catch of update Stock ${e} error from server  ${e.message}`); })
                            })
                            .catch(e => {console.log(`catch of specific item detail ${e} error from server  ${e.message}`); })
                    })
                    .catch(e => {setMessage(`catch of sale detail ${e} `);  console.log(`catch of sale detail ${e} `);})
            }
        })


        


    }

    const deleteInvoiceHandler = () => {
        //add logic of submit sale invoice for new values only
        console.log(`Deleting the Sale Invoice.......`);
        ////////////////////////check each item of the sale invoice and return back to the stock.
        invoiceItem.map((item) => {
            //Updating Item Stock
            // get quantity and showroom of an item
            itemService.get(item[6])
                .then(response2 => {
                    console.log("get specific Item detail")
                    console.log(response2.data);
                    const { id, quantity, showroom } = response2.data;
                    // update quantity and showroom  of item
                    var itemUpdated = {
                        quantity: parseInt(quantity) + parseInt(item[2]),
                        showroom: parseInt(showroom) + parseInt(item[2])
                    }
                    itemService.update(id, itemUpdated)
                        .then(response4 => {
                            setMessage(`Updated Stock value successfully`);
                        })
                        .catch(e => {
                            console.log(`catch of update Stock ${e}`);
                        })
                })

        })
        // delete sale Detail.

        inventoryService.deleteSaleInvoiceBySaleId(saleInvoice)
            .then(response2 => {
                console.log(`sale details has been removed of ${saleInvoice}`)
            })
            .catch(e => {
                console.log(`catch of update Stock ${e}`);
            })

        // delete sale invoices.

        inventoryService.deleteSale(saleInvoice)
            .then(response2 => {
                console.log(`sale has been deleted of ${saleInvoice}`)
            })
            .catch(e => {
                console.log(`catch of update Stock ${e}`);
            })

    }

    const removeItem = (item, index) => {
        //event.preventDefault();
        const temp = [...invoiceItem];
        temp.splice(index, 1);
        setInvoiceItem(temp);

    }

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "Quantity") {
            setSDQuantity(event.target.value);
        }
        else if (event.target.id === "Price") {
            setSDPrice(event.target.value);
        }
        else if (event.target.id === "customerSearch") {
            console.log(`customer input=${customerInput} ${event.target.value}`)
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

                                            <th style={{ width: "80%" }}>Name</th>
                                            <th>ShowRoom</th>
                                            <th>Cost</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{optionName.name}</td>
                                            <td>{optionName.showroom}</td>
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



    return (
        <div className="submit-form container">
            <h1>Edit Sale Invoice</h1>
            {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''}
            {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

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
                <div >
                    <button className="btn btn-success" type="submit" >Search</button>

                </div>
            </form>

            {saleData ?
                <div>
                    <h3>Sale View</h3>
                    <table border='1'>
                        <thead>
                            <tr>
                                <th>Reff Invoice</th>
                                <th>Customer Name</th>
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
                                        <td>{item.saleInvoiceId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.totalitems}</td>
                                        <td>{item.invoicevalue}</td>
                                        <td>{item.date}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                :
                ""
            }
            {invoiceItem.length > 0 ?
                <div>
                    <h3>Sale Invoice Detail View</h3>
                    <table id='returnTBL' border='1'>
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
                                <th>Item Id</th>
                                <th>Sale Detail ID</th>
                                <th>Sale Invoice Id</th>

                            </tr>
                        </thead>
                        <tbody>
                            {  // console.log(invoiceItem),
                                invoiceItem.map((item, index) => (
                                    // console.log(item),
                                    <tr key={index} onClick={() => editInvoceHandler(item)}>
                                        <td>{index + 1}</td>
                                        <td>{item[0]}</td>
                                        <td>{item[1]}</td>
                                        <td>{item[2]}</td>
                                        <td>{item[3]}</td>
                                        <td>{(parseFloat(item[3]) * parseFloat(item[2])).toFixed(3)}</td>
                                        <td>{(parseFloat(item[4]) * parseFloat(item[2])).toFixed(3)}</td>
                                        <td>{item[5]}</td>
                                        <td>{item[6]}</td>
                                        <td>{item[7]}</td>
                                        <td>{item[8]}</td>
                                        {item[7] ? <td>Old Invoice</td> : <td><button type="button" onClick={() => removeItem(item, index)}>Remove item</button></td>}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div>
                        {addItemBtn ?
                            <button className="btn btn-primary" type="button" onClick={submitInvoiceHandler}>Submit Invoice</button>
                            :
                            <button className="btn btn-primary" type="button" onClick={addItemHandler}>Add Item</button>
                        }
                        <button className="btn btn-primary" type="button" onClick={
                            () => {
                                if (window.confirm('Are you sure you want to Delet Sale Invoice?')) {
                                    // Save it!
                                    // console.log('Thing was saved to the database.');
                                    deleteInvoiceHandler();
                                } else {
                                    // Do nothing!
                                    setMessage('User Cancelled the Invoice Deletion.....');
                                }
                            }}
                        >Delete Invoice</button>

                    </div>
                </div>

                :
                ""
            }
            {edit === "True" ?
                <div className="form-group row">
                    <div>
                        Sale Detail Id = {sdId}
                    </div>
                    <div className="col-sm-2">
                        <label className="col-sm-2 col-form-label" htmlFor="Item" >Item </label>
                    </div>
                    <div className="col-sm-2">
                        <input type="text" name="itemSearch"
                            id="itemSearch" placeholder="Select Item"
                            value={itemInput}
                            onChange={handleChange}
                            onKeyDown={onKeyDownItem}
                        />

                        {optionListItem}
                    </div>

                    <div className="col-sm-4">

                        <input
                            type="text" name="Item"
                            id="Item" placeholder="ShowRoom Quantity"
                            //   value={cItem[0] ? cItem[0].showroom : ""}
                            disabled />
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2">
                            <label className="col-sm-2 col-form-label" htmlFor="Item" >Quantity </label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="Quantity"
                                id="Quantity" placeholder="Quantity"
                                value={sdQuantity} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2">
                            <label className="col-sm-2 col-form-label" htmlFor="Item" >Price </label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="Price"
                                id="Price" placeholder="Price"
                                value={sdPrice} onChange={handleChange} />

                        </div>
                        <div>
                            <button className="btn btn-primary" type="button" onClick={updateInvoceHandler}>Update Record</button>
                            <button className="btn btn-primary" type="button" onClick={deleteRecordHandler}>Delete Record</button>
                        </div>
                    </div>
                </div>
                :
                ""
            }
        </div>
    )
}

const mapStateToProps = state => ({
    itemData: state.item.items,
    user: state.user.users,
    saleData: state.sale.sale,
    saleInvoiceDetailData: state.sale.saleInvoiceDetail,
    userData: state.user.users
})

const mapDispatchToProps = dispatch => ({
    fetchSaleByDate: (sDate, eDate, id) => dispatch(fetchSaleByDate(sDate, eDate, id)),
    fetchSaleInvoiceDetailAsync: (invoiceId) => dispatch(fetchSaleInvoiceDetailAsync(invoiceId)),
    fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),
    fetchUserStartAsync: () => dispatch(fetchUserStartAsync()),
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync())

});

export default connect(mapStateToProps, mapDispatchToProps)(EditSale);
