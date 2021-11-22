import React, { useState, useEffect,useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import SearchUser from "../user/searchUser.component";
//import {fetchStockStartAsync,setCurrentStock} from '../../redux/stock/stock.action';

//import { fetchItemStartAsync, setCurrentItem } from '../../redux/item/item.action';

import { fetchPurchaseByInputStartAsync,fetchPurInvPayDetial } from '../../redux/purchase/purchase.action';
import { setCurrentUser } from '../../redux/user/user.action';
import inventoryService from '../../services/inventory.service';
import user from '../../services/user.service';
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';

const AccountPayable = ({fetchPurInvPayDetial,purInvDetail,
    fetchPurchaseByInputStartAsync,
    currentUser,
    purchaseInvoice,
    isFetching,currentUser1 }) => {
    const [pInvoice,setPInvoice] = useState(purchaseInvoice);
    const [currentInvoice, setCurrentInvoice] = useState([]);
    const [pInvPayDetail, setPInvPayDetail] = useState([]);
    const [cashPayment,setCashPayment] = useState(0);
    const [bankPayment,setBankPayment] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [access,setAccess] = useState(false);

    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
         setAccess(checkAccess("ACCOUNT PAYABLE",currentUser1.rights));
        //console.log(`access value = ${access}`)
     }
         , []);

    useEffect(() => {
        if (currentUser != null) {
            console.log("fetching invoice of the customer...");
            fetchPurchaseByInputStartAsync(currentUser.id);
        }
    }, [fetchPurchaseByInputStartAsync, currentUser])

    useEffect(() => {
       setPInvoice(purchaseInvoice);
    }, [purchaseInvoice])

    useEffect(() => {
        setPInvPayDetail(purInvDetail)
     }, [purInvDetail])

     
    const handleChange = event => {
      if(event.target.id === "cashPayment") {
          setCashPayment(event.target.value);}
      else if(event.target.id === "bankPayment") {
            setBankPayment(event.target.value);}
      } 
      
      const getPaymentDetail = (invoiceId) =>{
          console.log(`purchase payment Details is called ${invoiceId}`)
        fetchPurInvPayDetial(invoiceId);
        // setPInvPayDetail(purInvDetail)

      }

      const updatHandler =() =>{
        if(currentInvoice.Outstanding < parseInt(cashPayment)+parseInt(bankPayment)){
            alert("values are wrong...");
        }
        else{
            
            // 1-  PurchaseInvoicePayment
            //2- update the PurchaseInvoice
            // 3- update outstanding in user 

            setLoading(true);
           // var batch = firestore.batch();
            
           //var batch = firestore.batch();
            //////////////////////////////////////////////
            // 1- Add New record in the purchaseInvoicePayment
            /////////////////////////////////////////////
            var vPurchaseInvPay = {
                reffInvoice: currentInvoice.id,
                cashPayment: cashPayment,
                bankPayment: bankPayment
            }
            console.log(`id = ${currentInvoice.id}`)
            inventoryService.createPurchaseInvPay(vPurchaseInvPay)
            .then(res => {
                setMessage("Purchase Invoice Payment added successfully.....")
                console.log("Purchase Invoice Payment added successfully.....")

                ////////////////////////////
                //2- Update purchaseInvoice/ 
                ////////////////////////////
                var vPurchaseInv = {
                    Outstanding: parseInt(currentInvoice.Outstanding) -
                        parseInt(cashPayment) -
                        parseInt(bankPayment)
                }

                inventoryService.updatePurchase(currentInvoice.id, vPurchaseInv)
                    .then(res => {
                        setMessage("Update Purchase Outstanding completed successfully.....")
                        console.log("Update Purchase Outstanding completed successfully.....")
                    })
                    .catch(e => {
                        console.log(`catch of Purchase Outstanding ${e}
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
                        setPInvoice([]);
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
        
    }



    return (
        <div>
        {access ?
        <div className="submit-form">
            {loading ? <div className="alert alert-warning" role="alert">Processing....</div> : ''}
            {isFetching ? <div className="alert alert-warning" role="alert">Processing....</div> : ''}
            {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

            <SearchUser show="AccPay" />
            {/* get all invoices of the current user            */}
            {currentUser ?
                currentUser.id
                // fetchPurchaseByInputStartAsync(currentUser.id)

                : ""}
            {pInvoice ?
                <div>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Supplier id</th>
                                <th>Reff Invoice</th>
                                <th>Invoice Value</th>
                                <th>OutStanding</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pInvoice.map((item, index) => {
                                //console.log(index)
                                return (<tr key={index}>
                                    <td>{item.createdAt}</td>
                                    <td>{item.supplierId}</td>
                                    <td>{item.id}</td>
                                    <td>{item.invoicevalue}</td>
                                    <td>{item.Outstanding}</td>
                                    <td><button type="button" onClick={() => {
                                        setPInvPayDetail([]);
                                        setCurrentInvoice(item)}
                                        }>Make Payment</button></td>
                                    <td><button type="button" onClick={()=>{
                                        setCurrentInvoice([]);
                                        getPaymentDetail(item.id)
                                        }}>Payment Details</button></td>
                                </tr>)})}
                        </tbody>
                    </table>
                </div>

                :
                ""
            }
            {currentInvoice.id ?
                <div><div className="form-group row">
                    <label className="col-sm-2 col-form-label" htmlFor="Name">Reff Invoice</label>
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
            {pInvPayDetail ?
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
                            {pInvPayDetail.map((item, index) => {
                                //console.log(index)
                                return (<tr key={index}>
                                    <td>{item.createdAt}</td>
                                    <td>{item.reffInvoice}</td>
                                    <td>{item.cashPayment}</td>
                                    <td>{item.bankPayment}</td>
                                </tr>)})}
                        </tbody>
                    </table>
            </div>    :
            "No data for the Invoice "}
        </div>
         :
         "Access denied for the screen"}
         </div>
   )
}


const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    currentUser1: state.user.user.user,
    purchaseInvoice: state.purchase.purchase,
    purInvDetail :state.purchase.purInvPayDetail
})
const mapDispatchToProps = dispatch => ({
    fetchPurchaseByInputStartAsync: (userId) => dispatch(fetchPurchaseByInputStartAsync(userId)),
    fetchPurInvPayDetial : (invoiceId) => dispatch(fetchPurInvPayDetial(invoiceId)),

});


export default connect(mapStateToProps, mapDispatchToProps)(AccountPayable);