import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import SearchUser from "../user/searchUser.component";
//import {fetchStockStartAsync,setCurrentStock} from '../../redux/stock/stock.action';

//import { fetchItemStartAsync, setCurrentItem } from '../../redux/item/item.action';

import { fetchSaleByInputStartAsync, fetchSalInvPayDetial, fetchSaleAR, fetchSalePayHist, fetchSaleInvoiceDetail } from '../../redux/Sale/sale.action';
import { setCurrentUser } from '../../redux/user/user.action';
import inventoryService from '../../services/inventory.service';
import user from '../../services/user.service';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const AccountReceivable = ({ fetchSalInvPayDetial, salInvDetail,
    fetchSaleByInputStartAsync,
    fetchSaleAR, saleArData,
    fetchSalePayHist, salePayHist,
    currentUser,
    saleInvoice,
    isFetching, currentUser1 }) => {
    const [sInvoice, setSInvoice] = useState(saleInvoice);
    const [sInvPayDetail, setSInvPayDetail] = useState([]);
    const [payHist, setPayHist] = useState([])
    const [returnHist, setReturnHist] = useState([])
    const [currentInvoice, setCurrentInvoice] = useState([]);
    const [secInvoice,setSecInvoice]=useState([]);
    const [cashPayment, setCashPayment] = useState(0);
    const [bankPayment, setBankPayment] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [access, setAccess] = useState(false);
    const [totalOutStanding, setTotalOutStanding] = useState(0);
    const [totalInvoiceOutStanding, setTotalInvoiceOutStanding] = useState(0);
    const [nameInput, setNameInput] = useState("");
    const [reffInput, setReffInput] = useState("");
    const [reffInvoiceInput, setReffInvoiceInput] = useState("");
    const [agentNameInput, setAgentNameInput] = useState("");
    const [filteredOptionsName, setFilteredOptionsName] = useState([]);
    const [filteredOptionsReff, setFilteredOptionsReff] = useState([]);
    const [openInvoices, setOpenInvoices] = useState([]); 
    const [totalInvoiceValue, setTotalInvoiceValue] = useState([0]);
    const [filterOutstanding, setFilterOutstanding] = useState([0]);
    const [totalRecord, setTotalRecord] = useState([0]);

    const [arInvoiceId, setARInvoiceId] = useState();
    const [addressInput, setAddressInput] = useState("");
    const [amountInput, setAmountInput] = useState("");
    const [filter, setFilter] = useState("");


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
        var sumOutStanding = 0
        if (saleArData) {
            saleArData.map((item, index) => {
                sumOutStanding = sumOutStanding + item.salesOutstanding
                setTotalOutStanding(sumOutStanding)
                setFilteredOptionsName(saleArData)
            })
        }
    }, [saleArData])

    useEffect(() => {

        if (sInvoice) {
            setFilteredOptionsReff(sInvoice)
        }
    }, [sInvoice])

    useEffect(() => {

        if (filteredOptionsReff === 0) {
            setFilteredOptionsReff(sInvoice)
        }
    }, [filteredOptionsReff])

    useEffect(() => {
        var sumInvoiceValue = 0
        var sumOutstanding = 0
        var sumRecord = 1

        filteredOptionsName.map((item, index) => {
            sumInvoiceValue = sumInvoiceValue + item.saleInvoiceValue
            setTotalInvoiceValue(sumInvoiceValue)
            sumOutstanding = sumOutstanding + item.salesOutstanding
            setFilterOutstanding(sumOutstanding)
            sumRecord = index + 1
            setTotalRecord(sumRecord)
        })
    }, [filteredOptionsName])

    useEffect(() => {
        //order the array and assign it to sInvoice
        if (saleInvoice) {

            var arr = saleInvoice;

            function sortByKey(a, b) {
                //console.log(`sorting array ${a.Outstanding}`)
                return parseFloat(a.Outstanding) > parseFloat(b.Outstanding) ? -1 : parseFloat(a.Outstanding) < parseFloat(b.Outstanding) ? 1 : 0;
            }

            const sorted = arr.sort(sortByKey);
            //        console.log(sorted);
            console.log(sorted)

            setSInvoice(sorted);
        }
    }, [saleInvoice])

    useEffect(() => {
        setSInvPayDetail(salInvDetail)
    }, [salInvDetail])

    useEffect(() => {
        
        //check if the invoicevalue is -ive then show invoices with outstanding >0
        if (currentInvoice.id && currentInvoice.Outstanding<0)
        {
            //alert("invoice value is <0 show the outstanding invoices.....")
        
        setOpenInvoices(sInvoice.filter(
            option => {
                return option.Outstanding >0
            }
        ));
        console.log(openInvoices)
        }
        else
        {
            setOpenInvoices([])
        }
    }, [currentInvoice])

    useEffect(() => {
        setPayHist(salePayHist)
    }, [salePayHist])


  

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
        else if (event.target.id === "amount") {
            if (filter==="" || filter==="Please Select")
            {
                alert("Select the filter first");
            }
            else {
                setAmountInput(event.target.value);
                //search base on the filter value
                var selectedItem = [];
                if (filter === 'Equal To') {
                    console.log('Equal To filter is called')

                    selectedItem = filteredOptionsName.filter(
                        (option) => option.salesOutstanding === parseFloat(event.target.value)
                    );
                    // setFilteredOptionsName(saleArData.filter(
                    //     option => {
                    //         return (option) => option.salesOutstanding == parseInt(event.target.value)
                    //     }
                    // ));
                   
                }
                else if (filter === 'Greater Than') {
                    selectedItem = filteredOptionsName.filter(
                        (option) => option.salesOutstanding > parseFloat(event.target.value)
                    );
                }
                else if (filter === 'Less Than') {
                    selectedItem = filteredOptionsName.filter(
                        (option) => option.salesOutstanding < parseFloat(event.target.value)
                    );
                }
                
                setFilteredOptionsName(selectedItem)
            
            }
            
        }
        else if (event.target.id === "Filter") {
                setFilter(event.target.value);
                // apply the filter on these values

            
        }
        else if (event.target.id === "Name") {
            setNameInput(event.target.value);
            if (event.target.value === "" && agentNameInput === "" && addressInput === "") {
                setFilteredOptionsName(saleArData)
            }
            else if (agentNameInput !== "" && addressInput !== "") {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.agentname.toLowerCase().indexOf(agentNameInput.toLowerCase()) > -1 &&
                            option.name.toLowerCase().indexOf(nameInput.toLowerCase()) > -1 &&
                            option.address.toLowerCase().indexOf(addressInput.toLowerCase()) > -1
                    }
                ));
            }
            else if (agentNameInput === "" && addressInput !== "") {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.name.toLowerCase().indexOf(nameInput.toLowerCase()) > -1 &&
                            option.address.toLowerCase().indexOf(addressInput.toLowerCase()) > -1
                    }
                ));
            }
            else if (agentNameInput !== "" && addressInput === "") {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.agentname.toLowerCase().indexOf(agentNameInput.toLowerCase()) > -1 &&
                            option.name.toLowerCase().indexOf(nameInput.toLowerCase()) > -1
                    }
                ));
            }
            else if (agentNameInput === "" && addressInput === "") {
                setFilteredOptionsName(saleArData.filter(
                    (option) => option.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
                ));
            }
        }
        else if (event.target.id === "agentName") {
            setAgentNameInput(event.target.value);
            if (event.target.value === "" && addressInput === "" && nameInput === "") {
                setFilteredOptionsName(saleArData)
            }
            else if (nameInput !== "" && addressInput !== "") {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.agentname.toLowerCase().indexOf(agentNameInput.toLowerCase()) > -1 &&
                            option.name.toLowerCase().indexOf(nameInput.toLowerCase()) > -1 &&
                            option.address.toLowerCase().indexOf(addressInput.toLowerCase()) > -1
                    }
                ));
            }
            else if (nameInput === "" && addressInput !== "") {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.agentname.toLowerCase().indexOf(agentNameInput.toLowerCase()) > -1 &&
                            option.address.toLowerCase().indexOf(addressInput.toLowerCase()) > -1
                    }
                ));
            }
            else if (nameInput !== "" && addressInput === "") {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.agentname.toLowerCase().indexOf(agentNameInput.toLowerCase()) > -1 &&
                            option.name.toLowerCase().indexOf(nameInput.toLowerCase()) > -1
                    }
                ));
            }
            else if (nameInput === "" && addressInput === "") {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.agentname.toLowerCase().indexOf(agentNameInput.toLowerCase()) > -1
                    }
                ));
            }

        }
        else if (event.target.id === "address") {
            setAddressInput(event.target.value);
            if (event.target.value === "") {
                setFilteredOptionsName(saleArData)
            }
            else if (nameInput !== "" && agentNameInput !== "") {
                
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.address.toLowerCase().indexOf(addressInput.toLowerCase()) > -1 &&
                            option.name.toLowerCase().indexOf(nameInput.toLowerCase()) > -1 &&
                            option.agentname.toLowerCase().indexOf(agentNameInput.toLowerCase()) > -1
                    }
                ));
            }
            else if (nameInput !== "" && agentNameInput === "") {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.address.toLowerCase().indexOf(addressInput.toLowerCase()) > -1 &&
                            option.name.toLowerCase().indexOf(nameInput.toLowerCase()) > -1

                    }
                ));
            }
            else if (nameInput === "" && agentNameInput !== "") {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.address.toLowerCase().indexOf(addressInput.toLowerCase()) > -1 &&
                            option.agentname.toLowerCase().indexOf(agentNameInput.toLowerCase()) > -1

                    }
                ));
            }
            else {
                setFilteredOptionsName(saleArData.filter(
                    option => {
                        return option.address.toLowerCase().indexOf(addressInput.toLowerCase()) > -1
                    }
                ));
            }
        }
        else if (event.target.id === "reff") {
            setReffInput(event.target.value);
            if (event.target.value === "") {
                setFilteredOptionsReff(sInvoice)
            }
            else if (event.target.value !== "") {
                setFilteredOptionsReff(sInvoice.filter(
                    option => {
                        return option.id == event.target.value
                    }
                ));
            }
        }
        else if (event.target.id === "reffInvoice") {
            setReffInvoiceInput(event.target.value);
            if (event.target.value === "") {
                //reset all the values
                //show all AR
                setFilteredOptionsName(saleArData)
                //set customer invoice to blank as in case of refresh
                setFilteredOptionsReff([]);

            }


        }
    }

    const updateHandler = () => {
        console.log(`update is clicked.....${currentInvoice.Outstanding}`)
        console.log(`currrent invoice id .....${currentInvoice.id}`)
        if(currentInvoice.Outstanding<0)
        {
            // update two invoices.
            //1- currentInvoice.outstaning = currentInvoince.outstaning + (- secInvoince.InvoiceValue)
            //2- secInvoice.outstanding = secInvoice.outstanding + currentInvoice.out
            var cOutStanding = 0
            var secOutstanding = 0
            var cpayment = 0
            var spayment = 0
            var cComments = `Amount adjusted against =${secInvoice.id}` 
            var secComments = `Amount adjusted against =${currentInvoice.id}`
            if (secInvoice.Outstanding+(currentInvoice.Outstanding)>=0)
            {
            cOutStanding = 0
            secOutstanding = secInvoice.Outstanding+(currentInvoice.Outstanding)
            cpayment = -(secInvoice.Outstanding-(secInvoice.Outstanding+(currentInvoice.Outstanding)))    
            spayment = secInvoice.Outstanding-(secInvoice.Outstanding+(currentInvoice.Outstanding))    
            }
            else if(secInvoice.Outstanding+(currentInvoice.Outstanding)<0)
            {
                cOutStanding = currentInvoice.Outstanding + secInvoice.Outstanding
                secOutstanding = 0 
                cpayment = -(secInvoice.Outstanding)
                spayment = secInvoice.Outstanding
            }

            console.log(`
            currentOutstanding = ${cOutStanding}
            secondOutstanding = ${secOutstanding}
            currentpayment = ${cpayment}
            secondPayment = ${spayment} 
            comments for current invoice = ${cComments}
            comments for secondary invoice = ${secComments}
            `)
            // update currentInvoice
            var cvSaleInvPay = {
                reffInvoice: currentInvoice.id,
                cashPayment: cpayment,
                bankPayment: 0,
                comments:cComments
            }


            inventoryService.createSaleInvPay(cvSaleInvPay)
                .then(res => {
                    setMessage("Sale Invoice Payment added successfully.....")
                    console.log("Sale Invoice Payment added successfully.....")

                    ////////////////////////
                    //2- Update saleInvoice 
                    ///////////////////////
                    var cvSaleInv = {
                        Outstanding:cOutStanding
                    }
                    // console.log(`${parseInt(currentInvoice.Outstanding)} -
                    // ${parseInt(cashPayment)} -
                    // ${parseInt(bankPayment)}`)

                    inventoryService.updateSale(currentInvoice.id, cvSaleInv)
                        .then(res => {
                            setMessage("Update Sale Outstanding completed successfully.....")
                            console.log("Update Sale Outstanding completed successfully.....")

                        })
                        .catch(e => {
                            console.log(`catch of Sale Outstanding ${e}
                                          error from server  ${e.message}`);
                        })
                })
                .catch(e => {
                    console.log(`catch of Create Sale Invoice Payment ${e}
                error from server  ${e.message}`);
                })

        //update Second Invoice
        var svSaleInvPay = {
            reffInvoice: secInvoice.id,
            cashPayment: spayment,
            bankPayment: 0,
            comments:secComments
        }


        inventoryService.createSaleInvPay(svSaleInvPay)
            .then(res => {
                setMessage("Sale Invoice Payment added successfully.....")
                console.log("Sale Invoice Payment added successfully.....")

                ////////////////////////
                //2- Update saleInvoice 
                ///////////////////////
                var svSaleInv = {
                    Outstanding:secOutstanding
                }
                console.log(`${parseInt(currentInvoice.Outstanding)} -
                ${parseInt(cashPayment)} -
                ${parseInt(bankPayment)}`)

                inventoryService.updateSale(secInvoice.id, svSaleInv)
                    .then(res => {
                        setMessage("Update Sale Outstanding completed successfully.....")
                        console.log("Update Sale Outstanding completed successfully.....")

                    })
                    .catch(e => {
                        console.log(`catch of Sale Outstanding ${e}
                                      error from server  ${e.message}`);
                    })
            })
            .catch(e => {
                console.log(`catch of Create Sale Invoice Payment ${e}
            error from server  ${e.message}`);
            })

        }
        else
        {
        if (currentInvoice.Outstanding < parseInt(cashPayment) + parseInt(bankPayment)) {
            alert("values are wrong...");
        }
        else {

            // 1-  PurchaseInvoicePayment
            //2- update the PurchaseInvoice
            

            setLoading(true);
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
                    console.log(`${parseInt(currentInvoice.Outstanding)} -
                    ${parseInt(cashPayment)} -
                    ${parseInt(bankPayment)}`)

                    inventoryService.updateSale(currentInvoice.id, vSaleInv)
                        .then(res => {
                            setMessage("Update Sale Outstanding completed successfully.....")
                            console.log("Update Sale Outstanding completed successfully.....")


                            // clear and reload the invoice 
                            fetchSaleAR();
                            fetchSaleByInputStartAsync(0);
                            setSInvPayDetail([])
                            setCurrentInvoice([]);
                            setCashPayment(0);
                            setBankPayment(0);


                        })
                        .catch(e => {
                            console.log(`catch of Sale Outstanding ${e}
                                          error from server  ${e.message}`);
                        })




                })
                .catch(e => {
                    console.log(`catch of Create Sale Invoice Payment ${e}
                error from server  ${e.message}`);
                })

        }
    }
        setLoading(false)
    }

    const searchInvoiceHandler = () => {
        // search invoice and print the values.
        inventoryService.getSaleARByInvoiceId(reffInvoiceInput)
            .then(response2 => {
                setARInvoiceId(response2.data)
                console.log(response2.data)
                console.log(response2.data[0].name)

                ////get sale by customer name of the invoice.
                // it is giving wrong values
                // setFilteredOptionsName(saleArData.filter(
                //     (option) => option.name.toLowerCase().indexOf(response2.data[0].name.toLowerCase()) > -1
                // ));
                var arr = [
                    {
                        customerId: response2.data[0].customerId,
                        name: response2.data[0].name,
                        address: response2.data[0].address,
                        agentname: response2.data[0].agentname,
                        saleInvoiceValue: response2.data[0].invoicevalue,
                        salesOutstanding: response2.data[0].Outstanding
                    }
                ]

                setFilteredOptionsName(arr)
                //console.log(arr)


                //show specific invoice 

                //console.log(sInvoice)

                //
                setFilteredOptionsReff(sInvoice.filter(
                    option => {
                        return option.id == reffInvoiceInput
                    }
                ));

                //
            })
            .catch(e => {
                console.log(`get sale ar by invoice Report error ${e}`);
            })

    }

    const getPaymentDetail = (invoiceId) => {
        //console.log(`Sale payment Details is called ${invoiceId}`)
        fetchSalInvPayDetial(invoiceId);
        // check of the amount is -ive then show the open inovice with the outstanding >0

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
                    <h1>Accounts Receivable</h1>
                    <div>
                        <div className="form-group row">
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Customer Name</label>
                            </div>
                            <div className="col-sm-2">
                                <input
                                    type="text"
                                    name="Name"
                                    id="Name"
                                    placeholder="Customer Name"
                                    value={nameInput}
                                    onChange={handleChange} />
                            </div>
                            {/* </div> */}
                            {/* <div className="form-group row"> */}
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Agent Name</label>
                            </div>
                            <div className="col-sm-2">
                                <input
                                    type="text"
                                    name="agentName"
                                    id="agentName"
                                    placeholder="Agent Name"
                                    value={agentNameInput}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Address</label>
                            </div>
                            <div className="col-sm-2">
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    placeholder="Address"
                                    value={addressInput}
                                    onChange={handleChange} />
                            </div>
                            <div className="col-sm-2">
                                Filter
                                <select id="Filter" name="Filter" onChange={handleChange}>
                                    <option selected="Please Select" value="Please Select">Please Select</option>
                                    <option value="Equal To">Equal To</option>
                                    <option value="Greater Than">Greater Than</option>
                                    <option value="Less Than">Less Than</option>
                                </select>
                            </div>
                            <div className="col-sm-2">
                                <input
                                    type="text"
                                    name="amount"
                                    id="amount"
                                    placeholder="Amount"
                                    value={amountInput}
                                    onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Reff Invoice</label>
                            </div>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    name="reffInvoice"
                                    id="reffInvoice"
                                    placeholder="Reff Invoice"
                                    value={reffInvoiceInput}
                                    onChange={handleChange} />
                            </div>
                            <div className="col-sm-6">
                                <button className="btn btn-success" type="button" onClick={searchInvoiceHandler} >Search Invoice</button>
                            </div>
                        </div>



                        <div>
                            <ReactHTMLTableToExcel
                                className="btn btn-info"
                                table="OutstandingCustomer"
                                filename="ReportExcel"
                                sheet="Sheet"
                                buttonText="Export excel" />
                        </div>
                    </div>
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
                                    <div>Total Invoice Value = {totalInvoiceValue}</div>
                                    <div>Total Outstanding = {filterOutstanding}</div>
                                </div>
                            </div>
                            <table border="1" id="OutstandingCustomer">
                                <thead>
                                    <tr>

                                        <th>Customer id</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Agent Name</th>
                                        <th>Invoice Value</th>
                                        <th>OutStanding</th>
                                        <th>Oldest Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOptionsName.map((item, index) => {
                                        //console.log(index)
                                        return (
                                            <tr key={index}
                                            // onClick={() => selectSaleInvoice(item)}
                                            >
                                                <td>{item.customerId}</td>
                                                <td>{item.name}</td>
                                                <td>{item.address}</td>
                                                <td>{item.agentname}</td>
                                                <td>{item.saleInvoiceValue}</td>
                                                <td>{item.salesOutstanding}</td>
                                                <td>{(item.diff===null)?0:item.diff.days}</td>
                                                <td><button type="button" onClick={() => {
                                                    setSInvPayDetail([]);
                                                    setPayHist([]);
                                                    setCurrentInvoice([]);
                                                    selectSaleInvoice(item)
                                                }
                                                }>Show Sale Invoices</button></td>
                                                <td><button type="button" onClick={() => {
                                                    setSInvPayDetail([]);
                                                    setCurrentInvoice([]);
                                                    // selectSaleInvoice([]);
                                                    setSInvoice([]);
                                                    getPayHist(item.customerId)
                                                }
                                                }>Payment History</button></td>

                                            </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>

                        :
                        ""
                    }


                    {filteredOptionsReff.length>0 ?
                        <div>
                            <h1>Outstaning Invoices</h1>
                            <div className="form-group row">
                                <div className="col-sm-2">
                                    <label className="col-form-label" htmlFor="Item">Reff Invoice</label>
                                </div>
                                <div className="col-sm-6">
                                    <input
                                        type="text"
                                        name="reff"
                                        id="reff"
                                        placeholder="Reff Invoice"
                                        value={reffInput}
                                        onChange={handleChange} />
                                </div>
                            </div>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Customer id</th>
                                        <th>Customer Name</th>
                                        <th>Reff Invoice</th>
                                        <th>Invoice Value</th>
                                        <th>OutStanding</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOptionsReff.map((item, index) => {
                                        //console.log(index)
                                        //if (item.Outstanding!==0){
                                        return (
                                            <tr key={index}>
                                                <td>{item.createdAt}</td>
                                                <td>{item.customerId}</td>
                                                <td>{item.customers.name}</td>
                                                <td>{item.id}</td>
                                                <td>{item.invoicevalue}</td>
                                                <td>{item.Outstanding}</td>
                                                {/* <td><button type="button" onClick={() => setCurrentInvoice(item)}>Make Payment</button></td> */}
                                                <td><button type="button" onClick={() => {
                                                    setSInvPayDetail([]);
                                                    setPayHist([]);
                                                    setCurrentInvoice(item)
                                                    setSecInvoice([]);
                                                }
                                                }>Make Payment</button></td>
                                                <td><button type="button" onClick={() => {

                                                    setPayHist([]);
                                                    setCurrentInvoice([]);
                                                    selectSaleInvoice([]);
                                                    getPaymentDetail(item.id)
                                                }}>Payment Details</button></td>
                                            </tr>)
                                    }
                                        //}
                                    )}
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
                                <label className="col-sm-2 col-form-label" htmlFor="Name">Customer Name</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="reffInvoice"
                                        id="reffInvoice"
                                        placeholder="reffInvoice"
                                        value={currentInvoice.customers.name}
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
                                <button className="btn btn-success" type="button" onClick={updateHandler} >Update</button>
                            </div>
                        </div>
                        :
                        ""}
                     {openInvoices.length>0 ?
                    <div>
                         <table border="1">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Customer id</th>
                                        <th>Customer Name</th>
                                        <th>Reff Invoice</th>
                                        <th>Invoice Value</th>
                                        <th>OutStanding</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {openInvoices.map((item, index) => {
                                        //console.log(index)
                                        //if (item.Outstanding!==0){
                                        return (
                                            <tr key={index}>
                                                <td>{item.createdAt}</td>
                                                <td>{item.customerId}</td>
                                                <td>{item.customers.name}</td>
                                                <td>{item.id}</td>
                                                <td>{item.invoicevalue}</td>
                                                <td>{item.Outstanding}</td>
                                                {/* <td><button type="button" onClick={() => setCurrentInvoice(item)}>Make Payment</button></td> */}
                                                <td><button type="button" onClick={() => {
                                                    setSInvPayDetail([]);
                                                    setPayHist([]);
                                                    setSecInvoice(item)
                                                    setCashPayment(item.Outstanding)
                                                }
                                                }>Select Invoice</button></td>
                                            </tr>)
                                    }
                                        //}
                                    )}
                                </tbody>
                            </table>
                    </div>    
                    :
                    ""
                    }    
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
                    {sInvPayDetail && sInvPayDetail.length > 0 ?
                        <div>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Reff Inv.</th>
                                        <th>Cash Payment</th>
                                        <th>Bank Payment</th>
                                        <th>Comments</th>
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
                                            <td>{item.comments}</td>
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
    salePayHist: state.sale.salePayHist,

})
const mapDispatchToProps = dispatch => ({
    fetchSaleByInputStartAsync: (userId) => dispatch(fetchSaleByInputStartAsync(userId)),
    fetchSalInvPayDetial: (invoiceId) => dispatch(fetchSalInvPayDetial(invoiceId)),
    fetchSalePayHist: (custId) => dispatch(fetchSalePayHist(custId)),
    fetchSaleAR: () => dispatch(fetchSaleAR())
});


export default connect(mapStateToProps, mapDispatchToProps)(AccountReceivable);