import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import inventoryService from "../../services/inventory.service";
import userService from "../../services/user.service";
import itemService from "../../services/item.services";
import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchPurchaseByDate, fetchPurchaseInvoiceDetailAsync } from '../../redux/purchase/purchase.action';
import { fetchUserByInputAsync, fetchUserStartAsync } from '../../redux/user/user.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


const EditPurchase = ({
    fetchUserStartAsync, userData,
    fetchItemStartAsync, itemData,
    fetchSaleByDate,
    fetchPurchaseInvoiceDetailAsync, fetchUserByInputAsync,
    currentUser,
    fetchPurchaseByDate, purchaseData,
    purchaseInvoiceDetailData, user
}) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState("");
    const [edit, setEdit] = useState("");
    const [invoiceItem, setInvoiceItem] = useState([]);
    const [addItemBtn, setAddItemBtn] = useState(false);
    const [purchaseInvoice, setPurchaseInvoice] = useState("");

    const [pdId, setPDId] = useState("");
    const [pdItemName, setPDItemName] = useState("");
    const [pdPrice, setPDPrice] = useState("");
    const [pdQuantity, setPDQuantity] = useState("");

    const [pdOldId, setPDOldId] = useState("");
    const [pdOldItemName, setPDOldItemName] = useState("");
    const [pdOldPrice, setPDOldPrice] = useState("");
    const [pdOldQuantity, setPDOldQuantity] = useState("");
    const [pdCustomerId, setPDCustomerId] = useState("");
    const [pdItemId, setPDItemId] = useState("");
    const [pInvoiceId, setPInvoiceId] = useState("");

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
        fetchItemStartAsync();
    }, [fetchItemStartAsync])
    
    useEffect(() => {
        ////// load current invoice detail in Invoice Item from saleInvoiceDetailData
        //setInvoiceItem([...invoiceItem, [cItem[0].name, cItem[0].description, quantity, price, cItem[0].averageprice, (price * quantity) - (cItem[0].averageprice * quantity), cItem[0].id]]);
        if (purchaseInvoiceDetailData) {
            var arr = [];
            purchaseInvoiceDetailData.map((i) => {
                console.log(i)
                //setInvoiceItem([...invoiceItem,[i.items.name,i.items.description,i.quantity,i.price,i.cost,i.cost *i.price,i.id]])
                arr.push([i.items.name, i.items.description, i.quantity, i.price, (i.price * i.quantity), i.itemId, i.id, i.purchaseInvoiceId]);
                //console.log(invoiceItem)
                //console.log(invoiceItem.length)
            })
            setInvoiceItem(arr);

        }
    }, [purchaseInvoiceDetailData])

    const handleStartDTPicker = (date) => {
        setStartDate(date);
    }

    const handleEndDTPicker = (date) => {
        setEndDate(date);
    }

    const handleSubmit = event => {
        console.log(`handle submit is clicked...`)
        event.preventDefault();

        if (cCustomer.length > 0) {
            fetchPurchaseByDate(startDate.toDateString(), endDate.toDateString(), cCustomer[0].id);
        }
        else {
            fetchPurchaseByDate(startDate.toDateString(), endDate.toDateString(), "0");
        }

    }

    const selectInvoice = (item) => {
        //console.log("Select Invoice clicked");
        setPurchaseInvoice(item.id);

        setPDCustomerId(item.supplierId);
        fetchUserByInputAsync(item.supplierId);
        fetchPurchaseInvoiceDetailAsync(item.id);

    }

    const editInvoceHandler = (item) => {
        //console.log('edit purchase invoice.....')
        //console.log(`invoice id =${item.id}`)
        setEdit("True");
        console.log(item)

        setPDItemId(item[5]);
        setPInvoiceId(item[7])
        setPDId(item[6]);

        setPDOldItemName(item[0]);
        setPDOldPrice(item[3]);
        setPDOldQuantity(item[2]);

        // setPDId(item[7]);
        setPDItemName(item[0]);
        setItemInput(item[0])
        setPDPrice(item[3]);
        setPDQuantity(item[2]);

    }

    const updateInvoceHandler = () => {
        // console.log('edit sale invoice.....')
        if (pdId === "") {
            console.log(`new purchase details should be added....${purchaseInvoice}`)
            setInvoiceItem([...invoiceItem, [cItem[0].name, cItem[0].description, pdQuantity, pdPrice, (cItem[0].averageprice * pdQuantity), cItem[0].id, '', purchaseInvoice]]);
        }
        else {
            ////////////////////////////////// update invoce detail
            var idData = { price: pdPrice, quantity: pdQuantity };

            inventoryService.updatePurchaseDetail(pdId, idData)
                .then(resUpdateBalance => {
                    setMessage("Purchase Details updated .......");
                    console.log("Purchase Details updated .......");

                    ////////////////////////////////////////////////////////////

                    // call new service to recalculate the invoice value of given invoice no
                    inventoryService.getPurchaseRecalculate(pInvoiceId)
                        .then(res => {
                            setMessage("Purchase Recalculated .......");
                            console.log(`Purchase Recalculated .......`);
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

                    priceDiff = pdOldPrice - pdPrice;

                    quantityDiff = pdOldQuantity - pdQuantity;


                    if (priceDiff !== 0 && quantityDiff !== 0) {
                        amountDiff = priceDiff * amountDiff;
                    }
                    else if (priceDiff === 0 && quantityDiff !== 0) {
                        amountDiff = pdOldPrice * quantityDiff;
                    }
                    else if (priceDiff !== 0 && quantityDiff === 0) {
                        amountDiff = priceDiff * pdOldQuantity;
                    }
                    console.log(`
                Price Diff = ${pdOldPrice} - ${pdPrice} =  ${priceDiff}
                Quanity Diff = ${pdOldQuantity} - ${pdQuantity} = ${quantityDiff} = ${quantityDiff * -1}
                Amount Diff = ${amountDiff * -1}
                `)

                    ///////////update item value & average cost for the stock management 
                    //                console.log(`sdoldQuantity = ${sdOldQuantity}  sdprice = ${sdQuantity}`)
                    //if (quantityDiff > 0) {
                        //get current item values 
                        //calculate the average cost
                        itemService.get(pdItemId)
                            .then(res => {

                                console.log("get specific Item detail")
                                //console.log(response2.data);
                                const { id, quantity, showroom, averageprice } = res.data;
                                console.log(`item id = ${id}
                                item Quantity = ${quantity}
                                Item averagePrice = ${averageprice}
                                `);
                                //average price calculation
                                // need to check if the quantity is reduced and price is also changed
                                // what will be the impact on the average price.
                                var ap = 0;
                                if (averageprice === 0) {
                                    ap = pdOldPrice;
                                } else {
                                    //console.log(`(${parseInt(averageprice)}+${parseInt(item[2])})/2`);
                                    ap = (parseInt(averageprice) + parseInt(pdOldPrice)) / 2;
                                }
                                console.log(`Average price after calculation = ${ap}`)



                                var iData = {
                                    quantity: res.data.quantity - (quantityDiff ),
                                    showroom: res.data.showroom - (quantityDiff ),
                                    averageprice: ap
                                }
                                console.log(`Item quantity & showroom are ${res.data.quantity} ${res.data.showroom} .......`);
                                itemService.update(pdItemId, iData)
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
                    setMessage(`catch of updatePurchaseDetail ${error.response.request.response.message}`)
                    console.log(`catch of updatePurchaseDetail ${error.response.request.response.message}`);
                })

        }
    }

    const deleteRecordHandler = () => {
        console.log(`item to remove ${pdItemId} quantity = ${pdOldQuantity}
        saleDetail invoice id = ${pdId}
        sale invoice = ${pInvoiceId}`);
        //search the item and update the quantity in the items table
        // get quantity and showroom of an item
        itemService.get(pdItemId)
            .then(response2 => {
                console.log("get specific Item detail")
                console.log(response2.data);
                const { id, quantity, showroom,averageprice } = response2.data;
                // update quantity and showroom  of item
                var ap = 0;
                    if (averageprice === 0 || (parseInt(quantity) - parseInt(pdOldQuantity)===0)) {
                        ap = 0;
                    } else {
                        //console.log(`(${parseInt(averageprice)}+${parseInt(item[2])})/2`);
                        ap = (parseInt(averageprice)*2) - parseInt(pdOldPrice);
                    }
                    console.log(`Average price after calculation = ${ap}`)
                    console.log(`
                    quantity = ${parseInt(quantity)} - pdOldQuantity = ${parseInt(pdOldQuantity)} 
                    showroom = ${parseInt(showroom)} - pdOldQuantity = ${parseInt(pdOldQuantity)} 
                    
                    `)

                    // update quantity and showroom  of item
                    var itemUpdated = {
                        quantity: parseInt(quantity) - parseInt(pdOldQuantity),
                        showroom: parseInt(showroom) - parseInt(pdOldQuantity),
                        averageprice: ap
                    }
                console.log(`after qauntity = ${itemUpdated.quantity} showroom=${itemUpdated.showroom} averageprice =${ap}`)
                itemService.update(id, itemUpdated)
                    .then(response4 => {
                        setMessage(`Updated Stock value successfully`);


                        //Delete the purchaseDetail Invoice
                        inventoryService.deletePurchaseDetail(pdId)
                            .then(response2 => {
                                console.log(`purchase details has been removed of ${pdId}`)

                                ////////////////////////////////// update invoce Detail outstanding,tatalitem,invoice value 
                                // call new service to recalculate the invoice value of given invoice no
                                inventoryService.getPurchaseRecalculate(pInvoiceId)
                                    .then(res => {
                                        setMessage("Purchase Recalculated .......");
                                        console.log(`Purchase Recalculated .......${pInvoiceId}`);
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

        // /////clear all text boxes
        setPDId("");
        setPDItemName("");
        setPDPrice("");
        setPDQuantity("");
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
            if (!item[6]) {
                var pDetailData = ({
                    PurchaseInvoiceId: item[7],
                    // itemName: item[0],
                    itemName: item[5],
                    quantity: item[2],
                    price: item[3]
                    // profit should be calculated on run time
                });

                console.log(`purchase invoice = ${pDetailData.PurchaseInvoiceId}`)

                inventoryService.createPurchaseDetail(pDetailData)
                    .then(response1 => {
                        setMessage("Purchase Detail Entered");
                        console.log("Purchase Detail Entered")
                        console.log(response1.data);

                        ////////////////////////////////// update invoce Detail outstanding,tatalitem,invoice value 
                        // call new service to recalculate the invoice value of given invoice no
                        inventoryService.getPurchaseRecalculate(pDetailData.PurchaseInvoiceId)
                            .then(res => {
                                setMessage("Purchase Recalculated .......");
                                console.log(`Purchase Recalculated .......`);
                            })
                            .catch(error => {
                                setMessage(`catch of Recalculated ${error.response.request.response.message}`)
                                console.log(`catch of Recalculated ${error.response.request.response.message}`);
                            })
                        ////////////////////////////////////////////////////////////////


                        //Updating Item Stock
                        // get quantity and averageprice of an item
                        itemService.get(item[5])
                            .then(response2 => {
                                console.log("get specific Item detail")
                                console.log(response2.data);
                                const { id, quantity, showroom, averageprice } = response2.data;
                                // console.log(`item id = ${id}
                                // item Quantity = ${quantity}
                                // Item showroom = ${showroom}
                                // Item averagePrice = ${averagePrice}
                                // `);
                                //average price calculation
                                var ap = 0;
                                if (averageprice === 0) {
                                    ap = item[3];
                                } else {
                                    //console.log(`(${parseInt(averageprice)}+${parseInt(item[2])})/2`);
                                    ap = (parseInt(averageprice) + parseInt(item[3])) / 2;
                                }
                                console.log(`Average price after calculation = ${ap}`)

                                console.log(`invoice quantity = ${parseInt(item[2])} `)
                                // update quantity and showroom  of item
                                var itemUpdated = {
                                    quantity: parseInt(quantity) + parseInt(item[2]),
                                    showroom: parseInt(showroom) + parseInt(item[2]),
                                    averageprice: ap

                                }
                                itemService.update(id, itemUpdated)
                                    .then(response4 => {
                                        // console.log(`response qty =${response4.data.quantity}
                                        //     response showroom = ${response4.data.showroom}`)
                                        setMessage(`Updated Stock value successfully`);


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
                        setMessage(`catch of purchase detail ${e} `)
                        console.log(`catch of purchase detail ${e} `);
                    })


            }
        })


        // recalculate sale invoice


    }

    const deleteInvoiceHandler = () => {
        //add logic of submit sale invoice for new values only
        console.log(`Deleting the Purchase Invoice.......`);
        ////////////////////////check each item of the purchase invoice and return back to the stock.
        invoiceItem.map((item) => {
            //Updating Item Stock
            // get quantity and showroom of an item
            itemService.get(item[5])
                .then(response2 => {
                    console.log("get specific Item detail")
                    console.log(response2.data);
                    const { id, quantity, showroom, averageprice } = response2.data;
                    var ap = 0;
                    if (averageprice === 0 || (parseInt(quantity) - parseInt(item[2]))===0) {
                        ap = 0;
                    } else {
                        //console.log(`(${parseInt(averageprice)}+${parseInt(item[2])})/2`);
                        //ap = (parseInt(averageprice) - parseInt(item[3])) / 2;
                        ap = (parseInt(averageprice)*2) - parseInt(item[3]);
                    }
                    console.log(`Average price after calculation = ${ap}`)
                    console.log(`
                    quantity = ${parseInt(quantity)} - pdOldQuantity = ${parseInt(item[2])} 
                    showroom = ${parseInt(showroom)} - pdOldQuantity = ${parseInt(item[2])} 
                    
                    `)

                    // update quantity and showroom  of item
                    var itemUpdated = {
                        quantity: parseInt(quantity) - parseInt(item[2]),
                        showroom: parseInt(showroom) - parseInt(item[2]),
                        averageprice : ap
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
        // delete purchase Detail.

        inventoryService.deletePurchaseInvoiceByPurchaseId(purchaseInvoice)
            .then(response2 => {
                console.log(`purchase details has been removed of ${purchaseInvoice}`)
                setMessage(`purchase details has been removed of ${purchaseInvoice}`);
            })
            .catch(e => {
                console.log(`catch of update purchase Details ${e}`);
                setMessage(`catch of update purchase Details ${e}`);
            })

        // delete purchase invoices.

        inventoryService.deletePurchase(purchaseInvoice)
            .then(response2 => {
                console.log(`purchase has been deleted of ${purchaseInvoice}`)
                setMessage(`purchase has been deleted of ${purchaseInvoice}`)
            })
            .catch(e => {
                console.log(`catch of purchase invoce ${e}`);
                setMessage(`catch of purchase invoce ${e}`);
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
            setPDQuantity(event.target.value);
        }
        else if (event.target.id === "Price") {
            setPDPrice(event.target.value);
        }
        else if (event.target.id === "customerSearch") {
            console.log(`customer input=${customerInput} ${event.target.value}`)
            if (userData.user) {
                setFilteredOptionsCustomer(userData.user.filter(
                    // console.log(userData[0].name)
                    (option) =>
                        option.name.toLowerCase().indexOf(customerInput.toLowerCase()) > -1 && option.roles.toUpperCase() === "SUPPLIER"
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
            <h1>Edit Purchase Invoice</h1>
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

            {purchaseData ?
                <div>
                    <h3>Purchase View</h3>
                    <table border='1'>
                    <thead>
                                <tr>
                                    <th>Reff Invoice</th>
                                    <th>Purchase Id</th>
                                    <th>Customer Name</th>
                                    <th>Total Items</th>
                                    <th>Invoice Value</th>
                                    <th>Date Time</th>
                                </tr>
                            </thead>
                        <tbody>
                            {
                                purchaseData.map((item, index) => (
                                    //   console.log(item);
                                    <tr key={index}
                                        onClick={() => selectInvoice(item)}
                                    >
                                         <td>{item.reffInvoice}</td>
                                            <td>{item.id}</td>
                                            <td>{item.suppliers.name}</td>
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
            {invoiceItem.length > 0 ?
                <div>
                    <h3>Purchase Invoice Detail View</h3>
                    <table id='returnTBL' border='1'>
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Item Code</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Cost</th>
                                <th>Total Cost</th>
                                <th>Item Id</th>
                                <th>Purchase Detail ID</th>
                                <th>Purchase Invoice Id</th>
                            </tr>
                            </thead>
                        <tbody>
                            {  // console.log(invoiceItem),
                                invoiceItem.map((item, index) => (
                                    // console.log(item),
                                    <tr key={index} onClick={() => editInvoceHandler(item)}>
                                        <td>{index + 1}</td>
                                        <td>{item[0]}{/*item code*/}</td>
                                        <td>{item[1]}{/*item Description*/}</td>
                                        <td>{item[2]}{/*PD Quantity*/}</td>
                                        <td>{item[3]}{/*PD Cost*/}</td>
                                        <td>{item[4]}{/*PD Total Cost not from DB*/}</td>
                                        <td>{item[5]}{/*item ID*/}</td>
                                        <td>{item[6]}{/*PD ID*/}</td>
                                        <td>{item[7]}{/*P ID*/}</td>
                                        {item[6] ? <td>Old Invoice</td> : <td><button type="button" onClick={() => removeItem(item, index)}>Remove item</button></td>}
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
                                if (window.confirm('Are you sure you want to Delet Purchase Invoice?')) {
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
                        Purchase Detail Id = {pdId}
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
                                value={pdQuantity} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2">
                            <label className="col-sm-2 col-form-label" htmlFor="Item" >Price </label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="Price"
                                id="Price" placeholder="Price"
                                value={pdPrice} onChange={handleChange} />

                        </div>
                        <div>
                            <button className="btn btn-primary" type="button" onClick={updateInvoceHandler}>Update Record</button>
                            <button className="btn btn-primary" type="button" onClick={deleteRecordHandler}>Delete Record</button>
                        </div>
                    </div>I
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
    purchaseData: state.purchase.purchase,
    purchaseInvoiceDetailData: state.purchase.purchaseInvoiceDetail,
    userData: state.user.users
})

const mapDispatchToProps = dispatch => ({
    fetchPurchaseByDate: (sDate, eDate, id) => dispatch(fetchPurchaseByDate(sDate, eDate, id)),
    fetchPurchaseInvoiceDetailAsync: (invoiceId) => dispatch(fetchPurchaseInvoiceDetailAsync(invoiceId)),
    fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),
    fetchUserStartAsync: () => dispatch(fetchUserStartAsync()),
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync())

});

export default connect(mapStateToProps, mapDispatchToProps)(EditPurchase);
