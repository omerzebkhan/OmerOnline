import React, { useState, useEffect,useLayoutEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { connect } from 'react-redux';

import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchUserStartAsync } from '../../redux/user/user.action';
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';

import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";
import ownerStockService from "../../services/ownerStock.services"
import userService from "../../services/user.service";


const PurchaseInvoice = ({
    fetchItemStartAsync, itemData,
    fetchUserStartAsync, userData,
    currentUser,currentUser1 }) => {

    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [invoice, setInvoice] = useState("");
   
    const [invoiceItem, setInvoiceItem] = useState([]);
    const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
    const [totalInvoiceQuantity, setTotalInvoiceQuantity] = useState(0);
    const [qty, setQty] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [content, setContent] = useState("");
    const [access,setAccess] = useState(false);
    const [lastCost,setLastCost] = useState([])

    const [cItem, setcItem] = useState([]);
    const [itemInput, setItemInput] = useState("");
    const [activeOptionItem, setActiveOptionItem] = useState("");
    const [showOptionsItem, setShowOptionsItem] = useState(false);
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);

    const [cSupplier, setcSupplier] = useState([]);
    const [supplierInput, setSupplierInput] = useState("");
    const [activeOptionSupplier, setActiveOptionSupplier] = useState("");
    const [showOptionsSupplier, setShowOptionsSupplier] = useState(false);
    const [filteredOptionsSupplier, setFilteredOptionsSupplier] = useState([]);

    const [cOwner, setcOwner] = useState([]);
    const [ownerInput, setOwnerInput] = useState("");
    const [activeOptionOwner, setActiveOptionOwner] = useState("");
    const [showOptionsOwner, setShowOptionsOwner] = useState(false);
    const [filteredOptionsOwner, setFilteredOptionsOwner] = useState([]);


    useLayoutEffect(() => {
        checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("PURCHASE INVOICE",currentUser1.rights));
    }
        , []);

        useEffect(() => {
            fetchItemStartAsync();
        }, [fetchItemStartAsync])
    
        // useEffect(() => {
        //     setFilteredOptionsItem(itemData);
        // }, [itemData])
    
    
        useEffect(() => {
            fetchUserStartAsync();
        }, [fetchUserStartAsync])
   

    useEffect(() => {
        setMessage("");
    }, []);

    
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
        else if (event.target.id === "supplierSearch") {   
           if(userData.user){
            setFilteredOptionsSupplier(userData.user.filter(
                // console.log(userData[0].name)
                (option) =>
                    option.name.toLowerCase().indexOf(supplierInput.toLowerCase()) > -1 && option.roles.toUpperCase() === "SUPPLIER"
                   //option.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 && option.roles.toUpperCase() === "CUSTOMER"
            ));
            setActiveOptionSupplier(0);
            setShowOptionsSupplier(true);
            //setCustomerInput(customerInput);
            setSupplierInput(event.target.value);}
            else{setMessage(`No data for customer search...`)}
        }
        else if (event.target.id === "ownerSearch") {  
            console.log(event.target.value) 
            if(userData.user){
             setFilteredOptionsOwner(userData.user.filter(
                 // console.log(userData[0].name)
                 (option) =>
                     option.name.toLowerCase().indexOf(ownerInput.toLowerCase()) > -1 && option.roles.toUpperCase() === "OWNER"
                    //option.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 && option.roles.toUpperCase() === "CUSTOMER"
             ));
             setActiveOptionOwner(0);
             setShowOptionsOwner(true);
             //setCustomerInput(customerInput);
             setOwnerInput(event.target.value);}
             else{setMessage(`No data for customer search...`)}
         }
    }

    const handleSubmit = event => {
        event.preventDefault();
        // check if same item is added twice 
        console.log(cItem[0].name)
        console.log(invoiceItem)
        var checkItem =  (invoiceItem.filter(
                 (option) => option[0].toLowerCase().indexOf(cItem[0].name.toLowerCase()) > -1
             ));
        if (checkItem.length>0)
        {
            setMessage('Item already in the Invoice')   
        }
        else{




        setInvoiceItem([...invoiceItem, [cItem[0].name, quantity, price, cItem[0].id]]);
        var total = parseFloat(price).toFixed(3);
        var qty = parseInt(quantity);
        // console.log(`outside map total=${total} && qty=${qty}`);
        
        if (invoiceItem.length === 0) {
            console.log("no value in the invoice item")
            setTotalInvoiceValue(total * qty);
            setTotalInvoiceQuantity(parseInt(qty));
        } else {

            // console.log(`total = ${total}
            // qty =${qty}
            // quantity = ${total*qty}`)
            setTotalInvoiceValue(totalInvoiceValue + (total * qty));
            setTotalInvoiceQuantity(parseInt(totalInvoiceQuantity) + qty);
        }

        // setTotalInvoiceQuantity(qty);
    }

    }

    const removeItem = (item, index) => {
        //event.preventDefault();
        const temp = [...invoiceItem];
        temp.splice(index, 1);
        setInvoiceItem(temp);
        setTotalInvoiceValue(parseFloat(totalInvoiceValue).toFixed(3) - (parseFloat(item[1]).toFixed(3) * parseFloat(item[2]).toFixed(3)));
        setTotalInvoiceQuantity(parseInt(totalInvoiceQuantity) - parseInt(item[1]));
        setQuantity("");
        setPrice("");
        setInvoice("");

    }

    const savePurchase = () => {
       // check if the owner is null then follow the normal procedure.
       // If owner is not null then make entery in the ownerStock table.

       console.log(cOwner.length)
       if (cOwner.length === 0)
       {
        console.log(`Save purchase is clicked without owner....'
        ${invoice}
        ${cSupplier[0].id}
        ${totalInvoiceValue}
        ${totalInvoiceQuantity}
        ${totalInvoiceValue}`)
        var data = {
            reffInvoice: invoice,
            supplierId: cSupplier[0].id ,
            invoicevalue: totalInvoiceValue,
            totalitems: totalInvoiceQuantity,
            paid: 0,
            Returned: 0,
            Outstanding: totalInvoiceValue
        };
        
        console.log(data)

        inventoryService.createPurchase(data)
            .then(response => {
                setMessage(`Purchase successfully Added Invoice id = ${response.data.id}`);
               
                // loop throuhg invoice item 
                //1-create new purchase detail 
                //2- get each item stock value and update stock value in the item table 

                invoiceItem.map((item) => {
                    var pDetailData = ({
                        PurchaseInvoiceId: response.data.id,
                        // itemName: item[0],
                        itemName: item[3],
                        quantity: item[1],
                        price: item[2]
                    });



                    inventoryService.createPurchaseDetail(pDetailData)
                        .then(response1 => {
                            setMessage("Purchase Detail Entered");
                            console.log("Purchase Detail Entered")
                            console.log(response1.data);
                            //Updating Item Stock
                            // get quantity and averageprice of an item
                            itemService.get(item[3])
                                .then(response2 => {
                                    console.log("get specific Item detail")
                                    console.log(response2.data);
                                    const { id, quantity,showroom, averageprice } = response2.data;
                                    console.log(`item id = ${id}
                                    item Quantity = ${quantity}
                                    Item averagePrice = ${averageprice}
                                    `);
                                    //average price calculation
                                    var ap = 0;
                                    if (averageprice === 0  || quantity ===0) {
                                        ap = item[2];
                                    } else {
                                        //console.log(`(${parseInt(averageprice)}+${parseInt(item[2])})/2`);
                                        //old formulea
                                        //ap = (parseInt(averageprice) + parseInt(item[2])) / 2;
                                        // item[2] = price
                                        // item[1] = quantity
                                       //old formulea
                                        // ap = parseInt(averageprice) + parseInt((item[2]*item[1])/item[1]);
                                       // New formulea
                                       // ap = (currentprice*currentqty)+(newprice*newqty)/ (currentqty+newqty)
                                       // ap = (avgprice*currentqty)+(newprice*newqty)/ (currentqty+newqty)
                                       ap = ((parseFloat(averageprice).toFixed(3)*parseFloat(quantity).toFixed(3)) + (parseFloat(item[2]).toFixed(3)*parseFloat(item[1]).toFixed(3)))/(parseInt(quantity)+parseInt(item[1]));
                                    }
                                    console.log(`Average price after calculation = ${ap}`)

                                    // update quantity and average price of item
                                    var itemUpdated = {
                                        quantity: parseInt(quantity) + parseInt(item[1]),
                                        showroom :parseInt(showroom) + parseInt(item[1]),
                                        averageprice: ap
                                    }
                                    itemService.update(item[3], itemUpdated)
                                        .then(response4 => {
                                            setMessage(`Updated Stock value successfully`);
                                            setMessage(`Updating stock of item id = ${item[3]}`);
                                       
                                       
                                            /////////////////////////////////////////////////////////////////////////////////////////
                                            //     //reset all state to block duplicate entry
                                            setQuantity("");
                                            setPrice("");
                                            setInvoice("");
                                            //setBtnItem("Show");
                                            setInvoiceItem([]);
                                            setTotalInvoiceValue(0);
                                            setTotalInvoiceQuantity(0);
                                            setQty([]);
                                            setLoading(false);
                                            //setcCustomer([]);
                                            //setcAgent([]);
                                            setcItem([]);
                                       
                                       
                                       
                                       
                                        })
                                        .catch(e => {
                                            console.log(`catch of update Stock ${e} error from server  ${e.message}`);
                                            setMessage(`catch of update Stock ${e} error from server  ${e.message}`);
                                        })
                                })
                                .catch(e => {
                                    console.log(`catch of specific item detail ${e} error from server  ${e.message}`);
                                    setMessage(`catch of specific item detail ${e} error from server  ${e.message}`);
                                })


                        })
                        .catch(e => {
                            console.log(`catch of purchase detail ${e} error from server  ${e.message} `);
                            setMessage(`catch of purchase detail ${e} error from server  ${e.message} `);
                        })

                })
            })
            .catch(e => {
                console.log(`catch of create purchase${e}`);
                setMessage(`catch of create purchase${e}`);
            });
        }
        else {
            
                console.log(`New Flow should be called`)
                setMessage("New Flow should be called")
                
                console.log(`Save purchase is clicked Owner Id....'
                ${invoice}
                ${cSupplier[0].id}
                ${totalInvoiceValue}
                ${totalInvoiceQuantity}
                ${totalInvoiceValue}
                ${cOwner[0].id}
                `)
                var data = {
                    reffInvoice: invoice,
                    supplierId: cSupplier[0].id ,
                    invoicevalue: totalInvoiceValue,
                    totalitems: totalInvoiceQuantity,
                    paid: 0,
                    Returned: 0,
                    Outstanding: totalInvoiceValue,
                    ownerid: cOwner[0].id
                };
                
                console.log(data)
        
                inventoryService.createPurchase(data)
                    .then(response => {
                        setMessage(`Purchase successfully Added Invoice id = ${response.data.id}`);
                       
                        // loop throuhg invoice item 
                        //1-create new purchase detail 
                        //2- get each item with owner id from ownerstock and update quantity and avgcost value in the ownerstock table 
        
                        invoiceItem.map((item) => {
                            var pDetailData = ({
                                PurchaseInvoiceId: response.data.id,
                                // itemName: item[0],
                                itemName: item[3],
                                quantity: item[1],
                                price: item[2]
                            });
        
        
        
                            inventoryService.createPurchaseDetail(pDetailData)
                                .then(response1 => {
                                    setMessage("Purchase Detail Entered");
                                    console.log("Purchase Detail Entered")
                                    console.log(response1.data);
                                    //Updating Item Stock
                                    // get quantity and averageprice of an item
                                    //call new owner Stock table to if item is not there then add new id.
                                    ownerStockService.getOwnerStockByOwnerAndItem(cOwner[0].id,item[3])
                                    //itemService.get(item[3])
                                        .then(response2 => {
                                            //check if the response2 is empty then add new item with quantity in the owner stock
                                            if (response2.data.length==0)
                                            {
                                                console.log("Create new entry in owner Stock")  
                                                var os = {
                                                   ownerid:cOwner[0].id,
                                                   itemid:item[3],
                                                   avgcost:item[2],
                                                   quantity:parseInt(item[1])
                                                };
                                                ///create new enty in the ownerStock table
                                                //ownerStockService
                                                ownerStockService.create(os)
                                                .then(response1 => {
                                                    console.log(`New owner stock entry created successfully`)
                                               
                                                })
                                                .catch(e => {
                                                    console.log(`catch of Create ownerStock ${e} error from server  ${e.message}`);
                                                    setMessage(`catch of Create ownerStock ${e} error from server  ${e.message}`);
                                                })



                                            }
                                            else
                                            {
                                            console.log("owner Stock value exits")
                                            console.log(response2.data[0]);
                                            const {id,itemid,quantity,avgcost } = response2.data[0];
                                            //based on the id we can update the avgcost and quantity because there should be only one entry for one owner and one item
                                            console.log(` id = ${id}
                                            item id = ${itemid}
                                            item Quantity = ${quantity}
                                            Item avgcost = ${avgcost}
                                            `);
                                           
                                         //average price calculation
                                         var ap = 0;
                                         if (avgcost === 0  || quantity ===0) {
                                             ap = item[2];
                                         } else {
                                            ap = ((parseFloat(avgcost).toFixed(3)*parseFloat(quantity).toFixed(3)) + (parseFloat(item[2]).toFixed(3)*parseFloat(item[1]).toFixed(3)))/(parseInt(quantity)+parseInt(item[1]));
                                         }
                                         console.log(`Average price after calculation = ${ap}`)
     
                                          // update quantity and average price of item
                                          var osUpdated = {
                                            quantity: parseInt(quantity) + parseInt(item[1]),
                                            avgcost: ap
                                        }
                                        //update the owner Stock new quantity and avgcost value
                                        ownerStockService.update(id, osUpdated)
                                        .then(response4 => {
                                            setMessage(`Updated ownerStock value successfully`);
                                            setMessage(`Updating ownerStock of item id = ${item[3]}`);
                                       
                                       
                                            /////////////////////////////////////////////////////////////////////////////////////////
                                            //     //reset all state to block duplicate entry
                                            setQuantity("");
                                            setPrice("");
                                            setInvoice("");
                                            //setBtnItem("Show");
                                            setInvoiceItem([]);
                                            setTotalInvoiceValue(0);
                                            setTotalInvoiceQuantity(0);
                                            setQty([]);
                                            setLoading(false);
                                            //setcCustomer([]);
                                            //setcAgent([]);
                                            setcItem([]);
                                       
                                       
                                       
                                       
                                        })
                                        .catch(e => {
                                            console.log(`catch of update Stock ${e} error from server  ${e.message}`);
                                            setMessage(`catch of update Stock ${e} error from server  ${e.message}`);
                                        })

                                        }
                                            
                                           
                                           
                                      
                                        })
                                        .catch(e => {
                                            console.log(`catch of getOwnerStockByOwnerAndItem ${e} error from server  ${e.message}`);
                                            setMessage(`catch of getOwnerStockByOwnerAndItem ${e} error from server  ${e.message}`);
                                        })
        
        
                                })
                                .catch(e => {
                                    console.log(`catch of purchase detail ${e} error from server  ${e.message} `);
                                    setMessage(`catch of purchase detail ${e} error from server  ${e.message} `);
                                })
        
                        })
                    })
                    .catch(e => {
                        console.log(`catch of create purchase${e}`);
                        setMessage(`catch of create purchase${e}`);
                    }); 
        

        }
    }

    const submitInvoceHandler = async () => {
        //setMessage(`Invoice has been Sumited`);
        if (invoiceItem.length===0)
        {
            setMessage('Enter Invoice Details')   
        }
        else{
        savePurchase();
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

        //call api to get the latest cost of an item.

        inventoryService.getPurcahseByLatestDate(selectedItem[0].id)
        .then(response2 => {console.log(response2); setLastCost(response2.data)})
        .catch(e => {console.log(`catch of getSaleByLatestDate ${e} error from server  ${e.message}`);
            })    

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
                                            <th>Avg. Cost</th>
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
    /////////////////////////// Drop down logic for Supplier 
    const onKeyDownSupplier = (e) => {
        //console.log("On change is fired")
        // const { activeOption, filteredOptions } = this.props;
        if (e.keyCode === 13) {
            setActiveOptionSupplier(0);
            setShowOptionsSupplier(false);
            setSupplierInput(filteredOptionsSupplier[activeOptionSupplier]);
        } else if (e.keyCode === 38) {
            if (activeOptionSupplier === 0) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionSupplier(activeOptionSupplier - 1)
        } else if (e.keyCode === 40) {
            if (activeOptionSupplier - 1 === filteredOptionsSupplier.length) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionSupplier(activeOptionSupplier + 1)
        }
    };
    const onClickSupplier = (e) => {
        setActiveOptionSupplier(0);
        setFilteredOptionsSupplier([]);
        setShowOptionsSupplier(false);

        console.log(`selecte customer id = ${e.currentTarget.dataset.id}`);
        console.log(`user data${userData.user[0].id}`);
        const selectedSupplier = userData.user.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        setSupplierInput(selectedSupplier[0].name);
        setcSupplier(selectedSupplier);
    };
    let optionListSupplier;
    if (showOptionsSupplier && supplierInput) {
        console.log(filteredOptionsSupplier);
        console.log(filteredOptionsSupplier.length)
        if (filteredOptionsSupplier.length) {
            optionListSupplier = (
                <ul className="options">
                    {filteredOptionsSupplier.map((optionName, index) => {
                        let className;
                        if (index === activeOptionSupplier) {
                            className = 'option-active';
                        }
                        return (
                            <li key={optionName.id} className={className} data-id={optionName.id} onClick={onClickSupplier}>
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
            optionListSupplier = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }
    //////////////////////////////////////////////////////////////////////

      //////////////////////////////////////////////////////////////////////
    /////////////////////////// Drop down logic for Owner 
    const onKeyDownOwner = (e) => {
        //console.log("On change is fired")
        // const { activeOption, filteredOptions } = this.props;
        if (e.keyCode === 13) {
            setActiveOptionOwner(0);
            setShowOptionsOwner(false);
            setSupplierInput(filteredOptionsOwner[activeOptionOwner]);
        } else if (e.keyCode === 38) {
            if (activeOptionOwner === 0) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionOwner(activeOptionOwner - 1)
        } else if (e.keyCode === 40) {
            if (activeOptionOwner - 1 === filteredOptionsOwner.length) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionOwner(activeOptionOwner + 1)
        }
    };
    const onClickOwner = (e) => {
        setActiveOptionOwner(0);
        setFilteredOptionsOwner([]);
        setShowOptionsOwner(false);

        console.log(`selecte Owner id = ${e.currentTarget.dataset.id}`);
        console.log(`user data${userData.user[0].id}`);
        const selectedOwner = userData.user.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        setOwnerInput(selectedOwner[0].name);
        setcOwner(selectedOwner);
    };
    let optionListOwner;
    if (showOptionsOwner && ownerInput) {
        console.log(filteredOptionsOwner);
        console.log(filteredOptionsOwner.length)
        if (filteredOptionsOwner.length) {
            optionListOwner = (
                <ul className="options">
                    {filteredOptionsOwner.map((optionName, index) => {
                        let className;
                        if (index === activeOptionOwner) {
                            className = 'option-active';
                        }
                        return (
                            <li key={optionName.id} className={className} data-id={optionName.id} onClick={onClickOwner}>
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
            optionListOwner = (
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
        <div className="submit-form container">
                    <h1>Purchase Invoice</h1>
                    {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''}
                    {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label" htmlFor="Invoice">Vendor Invoice No</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    name="Invoice"
                                    id="Invoice"
                                    placeholder="Invoice #"
                                    value={invoice}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Owner Name</label>
                                <input
                                    type="text"
                                    name="ownerSearch"
                                    id="ownerSearch"
                                    placeholder="Select Owner "
                                    value={ownerInput}
                                    onChange={handleChange}
                                    onKeyDown={onKeyDownOwner}
                                />
                                {optionListOwner}
                            </div>
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Owner Id</label>
                                <input
                                    type="text"
                                    name="Owner"
                                    id="Owner"
                                    placeholder="Select Owner"
                                    value={cOwner[0] ?
                                        cOwner[0].id
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>

                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Address</label>
                                <input
                                    type="text"
                                    name="Owner Address"
                                    id="ownerAddress"
                                    placeholder="Address"
                                    value={cOwner[0] ?
                                        cOwner[0].address
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>

                        </div>
                        <div className="form-group row">
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Supplier Name</label>
                                <input
                                    type="text"
                                    name="supplierSearch"
                                    id="supplierSearch"
                                    placeholder="Select Supplier "
                                    value={supplierInput}
                                    onChange={handleChange}
                                    onKeyDown={onKeyDownSupplier}
                                />
                                {optionListSupplier}
                            </div>
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Supplier Id</label>
                                <input
                                    type="text"
                                    name="Supplier"
                                    id="Supplier"
                                    placeholder="Select Supplier"
                                    value={cSupplier[0] ?
                                        cSupplier[0].id
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>

                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Address</label>
                                <input
                                    type="text"
                                    name="Supplier Address"
                                    id="supplierAddress"
                                    placeholder="Address"
                                    value={cSupplier[0] ?
                                        cSupplier[0].address
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
                                Total Price = {parseFloat(totalInvoiceValue).toFixed(3)}
                            </div>
                            <div className="col-sm-1">
                                <button className="btn btn-primary" type="submit">Add Item</button>

                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" type="button" onClick={submitInvoceHandler}>Submit Invoice</button>
                        </div>

                        <div>
                            {lastCost.length >0 ?
                            <div> <h2>Last Price</h2>
                                 <table border="1">
                                <thead>
                                    <tr>
                                        <th>Item Id</th>
                                        <th>Item Name</th>
                                        <th>Cost</th>
                                        <th>Date</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        lastCost.map((item, index) => {
                                            return (
                                            <tr key={index}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.price}</td>
                                                <td>{item.createdAt}</td>      
                                            </tr>
                                            )})
                                            }
                                      
                                      
                                </tbody>
                            </table>
                            </div>    :
                            ""}
                        </div>

                        <div>
                            <h2>Invoice</h2>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Item Code</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total Price</th>
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
                                                <td>{parseFloat(item[2] * item[1]).toFixed(3)}</td>
                                                <td><button type="button" onClick={() => removeItem(item, index)}>Remove item</button></td>
                                            </tr>
                                            )
                                        })
                                    )
                                        :
                                        ""}
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
    currentUser1: state.user.user.user,
    itemData: state.item.items,
    userData: state.user.users,
})

export default connect(mapStateToProps,mapDispatchToProps)(PurchaseInvoice);