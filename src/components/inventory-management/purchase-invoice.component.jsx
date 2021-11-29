import React, { useState, useEffect,useLayoutEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { connect } from 'react-redux';

import SearchItem from '../item/searchitem.component';
import SearchUser from '../user/searchUser.component';
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';

import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";
import userService from "../../services/user.service";


const PurchaseInvoice = ({ currentItem, currentUser,currentUser1 }) => {

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


    useLayoutEffect(() => {
        checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("PURCHASE INVOICE",currentUser1.rights));
    }
        , []);


    useEffect(() => {
        setBtnItem("Show")
    }, [currentItem])


    useEffect(() => {
        setBtnUser("Show")
    }, [currentUser])

    useEffect(() => {
        //  console.log(qty);
        //  console.log(qty.id);     
    }, [qty]);

    useEffect(() => {
        setMessage("");
    }, []);

    const btnItemHandler = (event) => {
        event.preventDefault();
        //console.log(event.target.attributes[0].nodeValue);
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
    }

    const handleSubmit = event => {
        event.preventDefault();
        // check if same item is added twice 
        setInvoiceItem([...invoiceItem, [currentItem.name, quantity, price, currentItem.id]]);
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

        var data = {
            reffInvoice: invoice,
            supplierId: currentUser.id,
            invoicevalue: totalInvoiceValue,
            totalitems: totalInvoiceQuantity,
            paid: 0,
            Returned: 0,
            Outstanding: totalInvoiceValue
        };

        inventoryService.createPurchase(data)
            .then(response => {
                setMessage(`Purchase successfully Added Invoice id = ${response.data.id}`);
                // console.log(response.data);
                // if invoice is added get the invoceid and store in invoice detail
                // update vendor with the total sale and outstanding

                //////////////////////Update Vendor////////////////////////
                // 1- get total purchase & outstanding value of current vendor.
                // 2- update the purchase & outstanding with curenct invoice values.
                userService.get(currentUser.id)
                    .then(resUser => {
                        // console.log(`supplier outstanding value = ${resUser.data.outstanding}
                        //              supplier total purchase value = ${resUser.data.totalamount}
                        // `);
                        var usrData = {
                            totalamount: parseInt(resUser.data.totalamount) + parseInt(totalInvoiceValue),
                            outstanding: parseInt(resUser.data.outstanding) + parseInt(totalInvoiceValue),

                        };
                        userService.update(currentUser.id, usrData)
                            .then(resUpdateBalance => {
                                setMessage("User Balance updated");
                            })
                            .catch(e => { setMessage(`catch of User Balance ${e} error from server  ${e.message}`)
                                          console.log(`catch of User Balance ${e} error from server  ${e.message}`);
                            })

                    })
                    .catch()


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
                                    const { id, quantity, averageprice } = response2.data;
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

    return (
        <div>
        {access ?
        <div className="submit-form container">
                    <h1>Purchase Invoice</h1>
                    {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''}
                    {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

                    <div>
                        {btnItem === 'Hide' ?
                            <SearchItem />
                            :
                            ""
                        }
                    </div>
                    <div>
                        {btnUser === 'Hide' ?
                            <SearchUser show="AccPay" />
                            :
                            ""
                        }
                    </div>
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
                            <label className="col-sm-2 col-form-label" htmlFor="Item">Item Id</label>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    name="Item"
                                    id="Item"
                                    placeholder="Select Item"
                                    value={currentItem ?
                                        currentItem.name
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>
                            <div className="col-sm-2">
                                <button id="btnItem" className="btn btn-primary" type="button" onClick={btnItemHandler}>{btnItem}</button>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label" htmlFor="Item">Supplier Id</label>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    name="Supplier"
                                    id="Supplier"
                                    placeholder="Select Supplier"
                                    value={currentUser ?
                                        currentUser.id
                                        :
                                        ""
                                    }
                                    disabled />
                            </div>
                            <div className="col-sm-2">
                                <button id="btnUser" className="btn btn-primary" type="button" onClick={btnItemHandler}>{btnUser}</button>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label" htmlFor="Quanity" >Quantity</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    name="Quantity"
                                    id="Quantity"
                                    placeholder="Quantity"
                                    value={quantity}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label" htmlFor="Price" >price</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    name="Price"
                                    id="Price"
                                    placeholder="Price"
                                    value={price}
                                    onChange={handleChange} />
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

const mapStateToProps = state => ({
    currentItem: state.item.currentItem,
    currentUser: state.user.currentUser,
    currentUser1: state.user.user.user
})

export default connect(mapStateToProps)(PurchaseInvoice);