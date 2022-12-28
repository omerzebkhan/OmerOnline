import React, { useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';


import { fetchSaleByIdAsync, fetchSaleInvoiceDetailAsync } from '../../redux/Sale/sale.action';
import { fetchUserByInputAsync } from '../../redux/user/user.action';

import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

const SaleReturn = ({
    fetchSaleByIdAsync, fetchSaleInvoiceDetailAsync, saleData, saleInvoiceDetailData,
    fetchUserByInputAsync, user, currentUser
}) => {

    const [invoiceNo, setInvoiceNo] = useState("");
    const [message, setMessage] = useState("");
   // const [returnSale,setRetrunSale] = useState([])
    //const [content, setContent] = useState("");
    const [access, setAccess] = useState(false);


    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("SALE RETURN", currentUser.rights));
        console.log(`access value = ${access}`)
    }
        , []);


    const handleChange = event => {
        console.log(`event id = ${event.target.id}
        event value = ${event.target.value}`);

        document.getElementById(event.target.id).value = event.target.value;
        if (event.target.id === "InvoiceNo") {
            setInvoiceNo(event.target.value);
        }

    }
    const handleSubmit = event => {
        event.preventDefault();

        fetchSaleByIdAsync(invoiceNo);

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
            saleReturn.push([item.id,item.itemid,item.price, item.cost, item.saleInvoiceId,parseInt(document.getElementById(index).value),item.quantity]);
            }
        })

        console.log(saleReturn)

        if (saleReturn.length === 0 )
        {setMessage(`Select any value to return`)}
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


                /////////////////////////////////////////////////////////////////////////////////
                //////////////Update Sale deatils amount to reduce the quantity  ///////////////
                /////////////////////////////////////////////////////////////////////////////////
                var vSaleDetails = ({
                    quantity: parseInt(item[6]) - parseInt(item[5])
                });
                console.log(`sale Detail id = ${item[0]} itemqty = ${item[6]} - returnqty = ${item[5]}  quantity = ${vSaleDetails.quantity}`)
             
                if (vSaleDetails.quantity===0)
                {
                    //delete sale detail
                    let resSaleDetail = await inventoryService.deleteSaleDetail(item[0])
                    .catch(e => {
                        console.log(`catch of Sale Return ${e} error from server  ${e.message}`)
                        setMessage(`catch of Sale Return ${e} error from server  ${e.message}`)
                    })
                    console.log(resSaleDetail)
                }
                else 
                {
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

                if (saleReturn.length === index+1)
                {  console.log(`updating sale invoice.......`)
                    var vSaleInvoice = {
                        Returned: parseInt(saleData.Returned) + totalReturnValue,
                        invoicevalue: parseInt(saleData.invoicevalue) - totalReturnValue,
                        Outstanding: parseInt(saleData.Outstanding) - totalReturnValue,
                        totalitems: parseInt(saleData.totalitems) - totalReturnQuantity
                    }
                    console.log(`Sale Invoice no =${saleData.id}
                                                                totalitems = ${vSaleInvoice.totalitems}
                                                                ${vSaleInvoice.Returned}
                                                                ${vSaleInvoice.Outstanding}
                                                                ${vSaleInvoice.invoicevalue}
                                                                `)
                    let res = await inventoryService.updateSale(saleData.id, vSaleInvoice)
                        .catch(e => {
                            console.log(`catch of Update Sale Invoice ${e} error from server  ${e.message}`)
                            setMessage(`catch of Update Sale Invoice ${e} error from server  ${e.message}`)
                        })
                        setMessage("Successfully Updated............")

                        // clear the profiles.
                        fetchSaleByIdAsync(invoiceNo);
                        fetchSaleInvoiceDetailAsync(invoiceNo);
                        saleInvoiceDetailData.map((item, index) => {
                           document.getElementById(index).value = ''
                           
                        })


                }
                
                //                     ////////////////////////////////////////////////////////////////

            } )

    }}



    const selectInvoice = (item) => {
        console.log("Select Invoice clicked");
        console.log(item.id);

        console.log(`customer id = ${item.customerId}`)
        // const { fetchUserByInputAsync } = this.props;
        fetchUserByInputAsync(item.customerId);

        fetchSaleInvoiceDetailAsync(item.id);
    }

    return (
        <div className="container">
            {access ?
                <div>
                    <div >
                        <div className="searchFormHeader"><h1>Sale Return</h1></div>
                        {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}
                   
                        <div className="searchForm">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="Name">Invoice No</label>
                                    <input
                                        type="text"
                                        name="InvoiceNo"
                                        id="InvoiceNo"
                                        placeholder="Invoice"
                                        onChange={handleChange} />
                                </div>
                                <div >
                                    <button className="btn btn-success" type="submit" >Search</button>

                                </div>
                            </form>

                        </div>
                        {saleData ?
                            <div>
                                <h3>Sale View</h3>
                                <table border='1'>

                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Reff Invoice</th>
                                            <th>Customer Name</th>
                                            <th>Total Items</th>
                                            <th>Invoice Value</th>
                                            <th>Date Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {   //console.log(saleData)
                                            // saleData.map((item, index) => (
                                            //     //   console.log(item);
                                            <tr key={1}
                                                onClick={() => selectInvoice(saleData)}
                                            >
                                                <td>{saleData.id}</td>
                                                <td>{saleData.reffInvoice}</td>
                                                <td>{saleData.customers.name}</td>
                                                <td>{saleData.totalitems}</td>
                                                <td>{saleData.invoicevalue}</td>
                                                <td>{saleData.createdAt}</td>
                                            </tr>
                                            // ))
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
    saleInvoiceDetailData: state.sale.saleInvoiceDetail
})


const mapDispatchToProps = dispatch => ({

    fetchSaleByIdAsync: (id) => dispatch(fetchSaleByIdAsync(id)),
    fetchSaleInvoiceDetailAsync: (invoiceId) => dispatch(fetchSaleInvoiceDetailAsync(invoiceId)),
    fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),

});

export default connect(mapStateToProps, mapDispatchToProps)(SaleReturn);