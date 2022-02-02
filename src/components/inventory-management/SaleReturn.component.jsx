import React, { useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';


import { fetchSaleByIdAsync, fetchSaleInvoiceDetailAsync } from '../../redux/Sale/sale.action';
import { fetchUserByInputAsync } from '../../redux/user/user.action';

import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';

const SaleReturn = ({
    fetchSaleByIdAsync, fetchSaleInvoiceDetailAsync, saleData, saleInvoiceDetailData,
    fetchUserByInputAsync, user,currentUser
}) => {

    const [invoiceNo, setInvoiceNo] = useState("");
    const [message, setMessage] = useState("");
    //const [content, setContent] = useState("");
    const [access,setAccess] = useState(false);


    useLayoutEffect(() => {
       // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("SALE RETURN",currentUser.rights));
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
        var returnQuantity=0;
        var totalReturnValue = 0;
        var totalReturnCost = 0;
        var totalReturnProfit = 0;
        var totalReturnQuantity = 0;
        // var qty1=[];

        //        var batch = firestore.batch();

        saleInvoiceDetailData.map((item, index) => {
           
            //console.log(`index value${document.getElementById(index)}`)
           // console.log(document.getElementById(index))
           // console.log(document.getElementById(index).value)
            if (document.getElementById(index).value !== '' ) {
                returnQuantity = 0;
                returnQuantity = document.getElementById(index).value;
                totalReturnValue = totalReturnValue + (document.getElementById(index).value * item.price);
                totalReturnCost = totalReturnCost + (document.getElementById(index).value * item.cost);
               // totalReturnProfit = totalReturnProfit + (document.getElementById(index).value * item.profit);
                totalReturnQuantity = parseInt(totalReturnQuantity) + parseInt(returnQuantity);
                console.log(` retrunQuantity = ${returnQuantity}
                totalReturnValue = ${totalReturnValue}
                totalReturnCost = ${totalReturnCost}
                totalReturnQuantity = ${totalReturnQuantity}
                         `)
                /////////////////////////////////////////////////////////////////////////////////
                ////////////////////Add values in the Sale Return table ////////////////////////
                /////////////////////////////////////////////////////////////////////////////////

                //1- create sale retun entry
                var vSaleReturn = ({
                    saleInvoiceId: item.saleInvoiceId,
                    itemId: item.itemId,
                    quantity: returnQuantity
                });
                console.log(`return Sale values`)
                console.log(vSaleReturn)


                inventoryService.createSaleReturn(vSaleReturn)
                    .then(resSaleReturn => {
                        console.log(`Sale Returned Entered Successfully.....`)
                        setMessage(`Sale Returned Entered Successfully.....`);

                        /////////////////////////////////////////////////////////////////////////////////
                        //////////////Update Sale deatils amount to reduce the quantity  ///////////////
                        /////////////////////////////////////////////////////////////////////////////////
                        var vSaleDetails = ({
                            quantity: parseInt(item.quantity) -  parseInt(returnQuantity)
                        });
                        console.log(`sale Detail id = ${item.id} itemqty = ${item.quantity} - returnqty = ${returnQuantity}  quantity = ${vSaleDetails.quantity}`)
                        inventoryService.updateSaleDetail(item.id,vSaleDetails)
                            .then(resUpdateSaleDetailQ => {
                                console.log(`Updated Sale Detail Successfully......`);
                                setMessage(`Updated Sale Detail Successfully......`);
              
                                 /////////////////////////////////////////////////////////////////////////////////
                                //////////////Update Item and Quantity Or showroom             //////////////////
                                 /////////////////////////////////////////////////////////////////////////////////


                                itemService.get(item.items.id)
                                    .then(response2 => {
                                        console.log(response2.data);
                                        const { id, quantity, showroom } = response2.data;
                                       
                                        console.log(`invoice quantity = ${parseInt(returnQuantity)} `)
                                        // update quantity and showroom  of item
                                        var itemUpdated = {
                                            quantity: parseInt(quantity) + parseInt(returnQuantity),
                                            showroom: parseInt(showroom) + parseInt(returnQuantity)
                                        }
                                        itemService.update(id, itemUpdated)
                                            .then(response4 => {
                                            //     console.log(`response qty =${response4.data.quantity}
                                            // response showroom = ${response4.data.showroom}`)
                                                setMessage(`Updated Stock value successfully`);
                                                console.log(`Updated Item value Quantity and showroom successfully`);

                                                 /////////////////////////////////////////////////////////////////////////////////
                                                //////////////Update sale Invoice             //////////////////
                                                /////////////////////////////////////////////////////////////////////////////////

                                                var vSaleInvoice ={
                                                    Returned: parseInt(saleData.Returned) + totalReturnValue,
                                                    invoicevalue : parseInt(saleData.invoicevalue) - totalReturnValue,
                                                    Outstanding: parseInt(saleData.Outstanding) - totalReturnValue,
                                                    totalitems : parseInt(saleData.totalitems) - totalReturnQuantity  
                                                }
                                                console.log(`Sale Invoice no =${saleData.id}
                                                totalitems = ${vSaleInvoice.totalitems}
                                                ${vSaleInvoice.Returned}
                                                ${vSaleInvoice.Outstanding}
                                                ${vSaleInvoice.invoicevalue}
                                                `)
                                                inventoryService.updateSale(saleData.id,vSaleInvoice)
                                                .then(res=>{
                                                    setMessage(`Sale Invoice updated successfully`)
                                                    console.log(`Sale Invoice updated successfully`)})              
                                            })
                                            .catch(e => {
                                                console.log(`catch of Update item ${e} error from server  ${e.message}`)
                                                setMessage(`catch of Update item ${e} error from server  ${e.message}`);    
                                            })
                                    })
                                    .catch(e => {
                                        console.log(`catch of retriving item ${e} error from server  ${e.message}`)
                                        setMessage(`catch of retriving item ${e} error from server  ${e.message}`)
                                    })
                            })
                            .catch(e => {
                                console.log(`catch of Update Sale Detail ${e} error from server  ${e.message}`)
                                setMessage(`catch of Update Sale Detail ${e} error from server  ${e.message}`)
                            }
                            )

                        ////////////////////////////////////////////////////////////////////////////////

                    })
                    .catch(e => {
                        console.log(`catch of Sale Return ${e} error from server  ${e.message}`)
                        setMessage(`catch of Sale Return ${e} error from server  ${e.message}`)
                    }
                    )


                ////////////////////////////////////////////////////////////////////////////////

            }
        })
       
    }




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
                                            <td>{item.items.name}</td>
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