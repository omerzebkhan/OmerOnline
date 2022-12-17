import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import { fetchSaleByInputStartAsync, fetchSalInvPayDetial, fetchSaleAR, fetchSalePayHist } from '../../redux/Sale/sale.action';
import { fetchCashFlowAP,fetchCashFlowPay } from '../../redux/cashFlow/cashFlow.action';
import { setCurrentUser } from '../../redux/user/user.action';
import cashFlowServices from '../../services/cashFlow.services';
import user from '../../services/user.service';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const CashFlowAP = ({
    fetchCashFlowAP, cashFlowApData,
    fetchCashFlowPay,cashFlowPay,
    currentUser,
    isFetching, currentUser1 }) => {
    // const [sInvoice, setSInvoice] = useState(saleInvoice);
    const [cfPay, setCFPay] = useState([]);
    const [payHist, setPayHist] = useState([])
    const [currentInvoice, setCurrentInvoice] = useState([]);
    const [cashPayment, setCashPayment] = useState(0);
    const [bankPayment, setBankPayment] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [access, setAccess] = useState(false);
    const [totalOutStanding, setTotalOutStanding] = useState(0);
    const [filteredOptionsName, setFilteredOptionsName] = useState([]);
    const [totalInvoiceOutStanding, setTotalInvoiceOutStanding] = useState(0);
    const [filteredOptionsReff, setFilteredOptionsReff] = useState([]);
    const [totalInvoiceValue, setTotalInvoiceValue] = useState([0]);
    const [filterOutstanding, setFilterOutstanding] = useState([0]);
    const [totalRecord, setTotalRecord] = useState([0]);

    const [arInvoiceId,setARInvoiceId] = useState();


    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("ACCOUNT RECEIVABLE", currentUser1.rights));
        console.log(`access value = ${access}`)
    }
        , []);

    useEffect(() => {
        fetchCashFlowAP();
    }, [fetchCashFlowAP])

    useEffect(() => {
        setCFPay(cashFlowPay)
    }, [cashFlowPay])


    useEffect(() => {
        var sumOutStanding = 0
        if (cashFlowApData) {
            cashFlowApData.map((item, index) => {
                sumOutStanding = sumOutStanding + item.outstanding
                setTotalOutStanding(sumOutStanding)
                setFilteredOptionsName(cashFlowApData)
            })
        }
    }, [cashFlowApData])

   

   
    
    useEffect(() => {
        var sumAmount = 0
        var sumOutstanding = 0
        var sumRecord = 1

        filteredOptionsName.map((item, index) => {
            sumAmount = sumAmount + item.amount
            setTotalInvoiceValue(sumAmount)
            sumOutstanding = sumOutstanding + item.outstanding
            setFilterOutstanding(sumOutstanding)
            sumRecord = index + 1
            setTotalRecord(sumRecord)
        })
    }, [filteredOptionsName])

   
   
    const selectSaleInvoice = (item) => {
        fetchSaleByInputStartAsync(item.customerId);
        setCurrentUser(item.customerId);
        setTotalInvoiceOutStanding(item.salesOutstanding);
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
        console.log('update is clicked.....')
        if (currentInvoice.Outstanding > parseInt(cashPayment) + parseInt(bankPayment)) {
            alert("values are wrong...");
        }
        else {

            // 1-  cash Flow Payment
            //2- update the cash Flow for outstanding
            

            setLoading(true);
            
            //////////////////////////////////////////////
            // 1- Add New record in the cashFlowPayment
            /////////////////////////////////////////////
            var vcashFlowPayment = {
                reffInvoice: currentInvoice.id,
                cashPayment: cashPayment,
                bankPayment: bankPayment
            }


            cashFlowServices.createCashFlowPay(vcashFlowPayment)
                .then(res => {
                    setMessage("Cash Flow Payment added successfully.....")
                    console.log("Cash Flow Payment added successfully.....")

                    ////////////////////////
                    //2- Update cash Flow outstanding amount 
                    ///////////////////////
                    var vSaleInv = {
                        outstanding: parseInt(currentInvoice.outstanding) -
                            parseInt(cashPayment) -
                            parseInt(bankPayment)
                    }
                    console.log(`${parseInt(currentInvoice.outstanding)} -
                    ${parseInt(cashPayment)} -
                    ${parseInt(bankPayment)}`)

                    cashFlowServices.updateCashFlow(currentInvoice.id, vSaleInv)
                        .then(res => {
                            setMessage("Update Sale Outstanding completed successfully.....")
                            console.log("Update Sale Outstanding completed successfully.....")


                            // clear and reload the invoice 
                            fetchCashFlowAP();
                            //fetchSaleByInputStartAsync(0);
                            //setSInvPayDetail([])
                            setCurrentInvoice([]);
                            setCashPayment(0);
                            setBankPayment(0);


                        })
                        .catch(e => {
                            console.log(`catch of Cash Flow Outstanding ${e}
                                          error from server  ${e.message}`);
                        })
                })
                .catch(e => {
                    console.log(`catch of Create cash Flow Invoice Payment ${e}
                error from server  ${e.message}`);
                })

        }
        setLoading(false)
    }

 

    const getPaymentDetail = (invoiceId) => {
        //console.log(`Sale payment Details is called ${invoiceId}`)
        fetchCashFlowPay(invoiceId);
    }

    const getPayHist = (custId) => {
        console.log(`payment history is called ${custId}`)
        fetchSalePayHist(custId);
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
                    <h1>Cash Flow Accounts Payable</h1>
                    
                    {filteredOptionsName ?
                        <div>
                            <div>
                                <div className="inputFormHeader"><h2>Summary</h2></div>
                                <div className="inputForm">
                                    <div>Total Outstanding = {totalOutStanding}</div>

                                </div>
                            </div>



                            <h1>Outstanding Customers</h1>
                            <div>
                                <div className="inputFormHeader"><h2>Filtered Summary</h2></div>
                                <div className="inputForm">
                                    <div>Total Records = {totalRecord}</div>
                                    <div>Total Amount = {totalInvoiceValue}</div>
                                    <div>Total Outstanding = {filterOutstanding}</div>
                                </div>
                            </div>
                            <table border="1" id="OutstandingCustomer">
                                <thead>
                                    <tr>

                                        <th>id</th>
                                        <th>Mode</th>
                                        <th>Amount</th>
                                        <th>Outstanding</th>
                                        <th>Created Date</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOptionsName.map((item, index) => {
                                        //console.log(index)
                                        return (
                                            <tr key={index}
                                            // onClick={() => selectSaleInvoice(item)}
                                            >
                                                <td>{item.id}</td>
                                                <td>{item.mode}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.outstanding}</td>
                                                <td>{item.createdAt}</td>
                                                <td>{item.comments}</td>
                                                <td><button type="button" onClick={() => {
                                                    setCFPay([]);
                                                    // setPayHist([]);
                                                    setCurrentInvoice(item)
                                                }
                                                }>Make Payment</button></td>
                                                <td><button type="button" onClick={() => {

                                                    setPayHist([]);
                                                    setCurrentInvoice([]);
                                                    selectSaleInvoice([]);
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
                        <div>
                            <div className="form-group row">
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
                                <label className="col-sm-2 col-form-label" htmlFor="Name">mode</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="reffInvoice"
                                        id="reffInvoice"
                                        placeholder="reffInvoice"
                                        value={currentInvoice.mode}
                                        disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label" htmlFor="Name">Amount</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="invoiceValue"
                                        id="invoiceValue"
                                        placeholder="Invoice Value"
                                        value={currentInvoice.amount}
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
                                        value={currentInvoice.outstanding}
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
                    {payHist && payHist.length > 0 ?
                        <div>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Customer Id</th>
                                        <th>Customer Name</th>
                                        <th>Sale Id</th>
                                        <th>Sale Payment Id</th>
                                        <th>Payment Time</th>
                                        <th>Cash Payment</th>
                                        <th>Bank Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payHist.map((item, index) => {
                                        //console.log(index)
                                        return (<tr key={index}>
                                            <td>{item.userid}</td>
                                            <td>{item.name}</td>
                                            <td>{item.sid}</td>
                                            <td>{item.sipid}</td>
                                            <td>{item.createdAt}</td>
                                            <td>{item.cashPayment}</td>
                                            <td>{item.bankPayment}</td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div> :
                        ""
                    }
                    {cfPay && cfPay.length > 0 ?
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
                                    {cfPay.map((item, index) => {
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
    cashFlowApData: state.cashFlow.cashFlowAP,
    cashFlowPay: state.cashFlow.cashFlowPay,
    

})
const mapDispatchToProps = dispatch => ({
    fetchCashFlowPay:(invoiceId) =>dispatch(fetchCashFlowPay(invoiceId)),
    fetchCashFlowAP: () => dispatch(fetchCashFlowAP())
});


export default connect(mapStateToProps, mapDispatchToProps)(CashFlowAP);