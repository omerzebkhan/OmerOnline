import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import SearchUser from "../user/searchUser.component";
//import {fetchStockStartAsync,setCurrentStock} from '../../redux/stock/stock.action';

//import { fetchItemStartAsync, setCurrentItem } from '../../redux/item/item.action';

import { fetchSaleByInputStartAsync, fetchSalInvPayDetial, fetchSaleAR } from '../../redux/Sale/sale.action';
import { setCurrentUser } from '../../redux/user/user.action';
import inventoryService from '../../services/inventory.service';
import user from '../../services/user.service';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

const AccountReceivable = ({ fetchSalInvPayDetial, salInvDetail,
    fetchSaleByInputStartAsync,
    fetchSaleAR, saleArData,
    currentUser,
    saleInvoice,
    isFetching, currentUser1 }) => {
    const [sInvoice, setSInvoice] = useState(saleInvoice);
    const [sInvPayDetail, setSInvPayDetail] = useState([]);
    const [currentInvoice, setCurrentInvoice] = useState([]);
    const [cashPayment, setCashPayment] = useState(0);
    const [bankPayment, setBankPayment] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [access, setAccess] = useState(false);

    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("ACCOUNT RECEIVABLE", currentUser1.rights));
        console.log(`access value = ${access}`)
    }
        , []);

   useEffect(() => {
        fetchSaleAR();

    }, [fetchSaleAR])


    useEffect(() => {
        setSInvoice(saleInvoice);
    }, [saleInvoice])

    useEffect(() => {
        setSInvPayDetail(salInvDetail)
    }, [salInvDetail])

    const selectSaleInvoice = (item) =>{
        fetchSaleByInputStartAsync(item.customerId);
    }

    const handleChange = event => {
        if (event.target.id === "cashPayment") {
            setCashPayment(event.target.value);
        }
        else if (event.target.id === "bankPayment") {
            setBankPayment(event.target.value);
        }
    }

    const updatHandler = () => {
        if (currentInvoice.Outstanding < parseInt(cashPayment) + parseInt(bankPayment)) {
            alert("values are wrong...");
        }
        else {

            // 1-  PurchaseInvoicePayment
            //2- update the PurchaseInvoice
            // 3- update outstanding in user 

            setLoading(true);
            //var batch = firestore.batch();
            //////////////////////////////////////////////
            // 1- Add New record in the saleInvoicePayment
            /////////////////////////////////////////////
            var vSaleInvPay = {
                reffInvoice: currentInvoice.id,
                cashPayment: cashPayment,
                bankPayment: bankPayment
            }


            inventoryService.createSaleInvPay(vSaleInvPay)
                .then(res => {
                    setMessage("Sale Invoice Payment added successfully.....")
                    console.log("Sale Invoice Payment added successfully.....")

                    ////////////////////////
                    //2- Update saleInvoice 
                    ///////////////////////
                    var vSaleInv = {
                        Outstanding: parseInt(currentInvoice.Outstanding) -
                            parseInt(cashPayment) -
                            parseInt(bankPayment)
                    }

                    inventoryService.updateSale(currentInvoice.id, vSaleInv)
                        .then(res => {
                            setMessage("Update Sale Outstanding completed successfully.....")
                            console.log("Update Sale Outstanding completed successfully.....")
                        })
                        .catch(e => {
                            console.log(`catch of Sale Outstanding ${e}
                                          error from server  ${e.message}`);
                        })



                    ///////////////////////////////////////////
                    //3- update Outstandig in the user profile
                    //////////////////////////////////////////
                    console.log(`current invoice outstanting = ${currentUser.outstanding}`);
                    var vUser = {
                        outstanding: parseInt(currentUser.outstanding) -
                            parseInt(cashPayment) -
                            parseInt(bankPayment)
                    }
                    console.log(`current invoice outstanting after = ${vUser.outstanding}`);
                    user.update(currentUser.id, vUser)
                        .then(res => {
                            setMessage("Update User Outstanding completed successfully.....")
                            console.log("Update User Outstanding completed successfully.....")

                            setLoading(false);
                            //console.log(currentItem)
                            setSInvoice([]);
                            setCurrentInvoice([]);
                            setCurrentUser([]);

                        })
                        .catch(e => {
                            console.log(`catch of User Outstanding ${e}
                                            error from server  ${e.message}`);
                        })
                })
                .catch(e => {
                    console.log(`catch of Create Sale Invoice Payment ${e}
                error from server  ${e.message}`);
                })

        }
        setLoading(false)
    }

    const getPaymentDetail = (invoiceId) => {
        console.log(`Sale payment Details is called ${invoiceId}`)
        fetchSalInvPayDetial(invoiceId);


    }

    return (
        <div>
            {access ?
                <div className="submit-form container">
                    {loading ? <div className="alert alert-warning" role="alert">Processing....</div> : ''}
                    {isFetching ? <div className="alert alert-warning" role="alert">Processing....</div> : ''}
                    {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

                    {/* <SearchUser show="AccRec" /> */}
                    {/* get all invoices of the current user            */}

                    {currentUser ?
                        currentUser.id
                        // fetchPurchaseByInputStartAsync(currentUser.id)

                        : ""}

                    {saleArData ?
                        <div>
                            <h1>Outstanding Customers</h1>
                            <table border="1">
                                <thead>
                                    <tr>
                                        
                                        <th>Customer id</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Invoice Value</th>
                                        <th>OutStanding</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {saleArData.map((item, index) => {
                                        //console.log(index)
                                        return (
                                            <tr key={index}  onClick={() => selectSaleInvoice(item)}>
                                                <td>{item.customerId}</td>
                                                <td>{item.name}</td>
                                                <td>{item.address}</td>
                                                <td>{item.saleInvoiceValue}</td>
                                                <td>{item.salesOutstanding}</td>
                                                
                                            </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>

                        :
                        ""
                    }


                    {sInvoice ?
                        <div>
                            <h1>Outstaning Invoices</h1>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Customer id</th>
                                        <th>Reff Invoice</th>
                                        <th>Invoice Value</th>
                                        <th>OutStanding</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sInvoice.map((item, index) => {
                                        //console.log(index)

                                        return (
                                            <tr key={index}>
                                                <td>{item.createdAt}</td>
                                                <td>{item.customerId}</td>
                                                <td>{item.id}</td>
                                                <td>{item.invoicevalue}</td>
                                                <td>{item.Outstanding}</td>
                                                {/* <td><button type="button" onClick={() => setCurrentInvoice(item)}>Make Payment</button></td> */}
                                                <td><button type="button" onClick={() => {
                                                    setSInvPayDetail([]);
                                                    setCurrentInvoice(item)
                                                }
                                                }>Make Payment</button></td>
                                                <td><button type="button" onClick={() => {
                                                    setCurrentInvoice([]);
                                                    getPaymentDetail(item.id)
                                                }}>Payment Details</button></td>
                                            </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>

                        :
                        ""
                    }
                    {currentInvoice.id ?
                        <div><div className="form-group row">
                            <label className="col-sm-2 col-form-label" htmlFor="Name">Invoice Id</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    name="reffInvoice"
                                    id="reffInvoice"
                                    placeholder="reffInvoice"
                                    value={currentInvoice.id}
                                    disabled />
                            </div>
                        </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label" htmlFor="Name">Invoice Value</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="invoiceValue"
                                        id="invoiceValue"
                                        placeholder="Invoice Value"
                                        value={currentInvoice.invoicevalue}
                                        disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label" htmlFor="Name">OutStanding</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="outStanding"
                                        id="outStanding"
                                        placeholder="outStanding"
                                        value={currentInvoice.Outstanding}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label" htmlFor="Name">Cash Payment</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="Cash Payment"
                                        id="cashPayment"
                                        placeholder="Cash Payment"
                                        value={cashPayment}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label" htmlFor="Name">Bank Payment</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="Bank Payment"
                                        id="bankPayment"
                                        placeholder="Bank Payment"
                                        value={bankPayment}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div >
                                <button className="btn btn-success" type="button" onClick={updatHandler} >Update</button>
                            </div>
                        </div>
                        :
                        ""}
                    {sInvPayDetail ?
                        <div>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Reff Inv.</th>
                                        <th>Cash Payment</th>
                                        <th>Bank Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sInvPayDetail.map((item, index) => {
                                        //console.log(index)
                                        return (<tr key={index}>
                                            <td>{item.createdAt}</td>
                                            <td>{item.reffInvoice}</td>
                                            <td>{item.cashPayment}</td>
                                            <td>{item.bankPayment}</td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div> :
                        ""}
                </div>
                :
                "Access denied for the screen"}
        </div>
    )
}


const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    currentUser1: state.user.user.user,
    saleInvoice: state.sale.sale,
    salInvDetail: state.sale.salInvPayDetail,
    saleArData: state.sale.saleAR,
})
const mapDispatchToProps = dispatch => ({
    fetchSaleByInputStartAsync: (userId) => dispatch(fetchSaleByInputStartAsync(userId)),
    fetchSalInvPayDetial: (invoiceId) => dispatch(fetchSalInvPayDetial(invoiceId)),
    fetchSaleAR: () => dispatch(fetchSaleAR())
});


export default connect(mapStateToProps, mapDispatchToProps)(AccountReceivable);