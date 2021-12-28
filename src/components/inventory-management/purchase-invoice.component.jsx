import React, { useState, useEffect,useLayoutEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { connect } from 'react-redux';

import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchUserStartAsync } from '../../redux/user/user.action';
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';

import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";
import userService from "../../services/user.service";


const PurchaseInvoice = ({
    fetchItemStartAsync, itemData,
    fetchUserStartAsync, userData,
    currentUser,currentUser1 }) => {

    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [invoice, setInvoice] = useState("");
    const [btnItem, setBtnItem] = useState("Show");
    const [btnUser, setBtnUser] = useState("Show");
    const [invoiceItem, setInvoiceItem] = useState([]);
    const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
    const [totalInvoiceQuantity, setTotalInvoiceQuantity] = useState(0);
    const [qty, setQty] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [content, setContent] = useState("");
    const [access,setAccess] = useState(false);

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
        //  console.log(qty);
        //  console.log(qty.id);     
    }, [qty]);

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
    }

    const handleSubmit = event => {
        event.preventDefault();
        // check if same item is added twice 
        setInvoiceItem([...invoiceItem, [cItem[0].name, quantity, price, cItem[0].id]]);
        var total = parseInt(price);
        var qty = parseInt(quantity);
        // console.log(`outside map total=${total} && qty=${qty}`);

        if (invoiceItem.length === 0) {
            console.log("no value in the invoice item")
            setTotalInvoiceValue(total * qty);
            setTotalInvoiceQuantity(parseInt(qty));
        } else {

            setTotalInvoiceValue(parseInt(totalInvoiceValue) + (total * qty));
            setTotalInvoiceQuantity(parseInt(totalInvoiceQuantity) + qty);
        }

        // setTotalInvoiceQuantity(qty);

    }

    const removeItem = (item, index) => {
        //event.preventDefault();
        const temp = [...invoiceItem];
        temp.splice(index, 1);
        setInvoiceItem(temp);
        setTotalInvoiceValue(parseInt(totalInvoiceValue) - (parseInt(item[1] * parseInt(item[2]))));
        setTotalInvoiceQuantity(parseInt(totalInvoiceQuantity) - parseInt(item[1]));
        setQuantity("");
        setPrice("");
        setInvoice("");

    }

    const savePurchase = () => {

        console.log(`save purchase is clicked....'
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
                // console.log(response.data);
                // if invoice is added get the invoceid and store in invoice detail
                // update vendor with the total sale and outstanding

                //////////////////////Update Vendor////////////////////////
                // 1- get total purchase & outstanding value of current vendor.
                // 2- update the purchase & outstanding with curenct invoice values.
                // userService.get(cSupplier[0].id)
                //     .then(resUser => {
                //         // console.log(`supplier outstanding value = ${resUser.data.outstanding}
                //         //              supplier total purchase value = ${resUser.data.totalamount}
                //         // `);
                //         var usrData = {
                //             totalamount: parseInt(resUser.data.totalamount) + parseInt(totalInvoiceValue),
                //             outstanding: parseInt(resUser.data.outstanding) + parseInt(totalInvoiceValue),

                //         };
                //         userService.update(cSupplier[0].id, usrData)
                //             .then(resUpdateBalance => {
                //                 setMessage("User Balance updated");
                //             })
                //             .catch(e => { setMessage(`catch of User Balance ${e} error from server  ${e.message}`)
                //                           console.log(`catch of User Balance ${e} error from server  ${e.message}`);
                //             })

                //     })
                //     .catch()


                ///////////////////////////////////////////////////////




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
                                    if (averageprice === 0) {
                                        ap = item[2];
                                    } else {
                                        //console.log(`(${parseInt(averageprice)}+${parseInt(item[2])})/2`);
                                        ap = (parseInt(averageprice) + parseInt(item[2])) / 2;
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
                                            setMessage(`Purchase successfully Added Invoice id = ${response.data.id}`);
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
                            console.log(`catch of purchase detail ${e}
                            error from server  ${e.message}
                            `
                            );
                        })

                })
            })
            .catch(e => {
                console.log(`catch of create purchase${e}`);
            });
    }

    const submitInvoceHandler = async () => {
        //setMessage(`Invoice has been Sumited`);
        savePurchase();


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
                                Total Price = {totalInvoiceValue}
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
                                                <td>{item[2] * item[1]}</td>
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