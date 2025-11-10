import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import { fetchPurchaseByDate, fetchPurchaseInvoiceDetailAsync,fetchPurchaseByDateSummary } from '../../redux/purchase/purchase.action';
import { fetchUserByInputAsync, fetchUserStartAsync } from '../../redux/user/user.action';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import PdfInvoice from "./printPurchaseInvoice";
import PrintPurchaseSummary from './printPurchaseSummary';

//class PurchaseReport extends React.Component {
const PurchaseReport = ({
    fetchUserStartAsync, userData,
    fetchItemStartAsync, itemData,
    fetchPurchaseByDate, purchaseData,
    fetchPurchaseInvoiceDetailAsync, purchaseInvoiceDetailData,
    fetchUserByInputAsync, user ,currentUser,
    fetchPurchaseByDateSummary,purchaseSummary
}) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [supplier, setSupplier] = useState({});

    const [totalSaleRecord, setTotalSaleRecord] = useState([0]);
    const [totalSaleItem, setTotalSaleItem] = useState(0);
    const [totalSaleInvVal, setTotalSaleInvVal] = useState(0);
    const [totalSaleProfit, setTotalSaleProfit] = useState(0);

    const [cCustomer, setcCustomer] = useState([]);
    const [customerInput, setCustomerInput] = useState("");
    const [activeOptionCustomer, setActiveOptionCustomer] = useState("");
    const [showOptionsCustomer, setShowOptionsCustomer] = useState(false);
    const [filteredOptionsCustomer, setFilteredOptionsCustomer] = useState([]);

    

    const [access, setAccess] = useState(false);
    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("STOCK REPORT", currentUser.rights));
        //console.log(`access value = ${access}`)
    }
        , []);

    useEffect(() => {
        fetchUserStartAsync();
    }, [fetchUserStartAsync])


    useEffect(() => {
        if (purchaseData) {
            var sumQuantity = 0
            var sumRecord = 1
            var sumInvValue = 0

            purchaseData.map((item, index) => {
                sumQuantity = sumQuantity + parseInt(item.totalitems)
                setTotalSaleItem(sumQuantity)
                sumRecord = index + 1
                setTotalSaleRecord(sumRecord)
                sumInvValue = sumInvValue + (item.invoicevalue)
                setTotalSaleInvVal(parseFloat(sumInvValue).toFixed(3))

            })
        }
    }, [purchaseData])

    

    const handleStartDTPicker = (date) => { setStartDate(date); }

    const handleEndDTPicker = (date) => { setEndDate(date); }

    const handleSubmit = event => {
        event.preventDefault();

        event.preventDefault();
        //console.log(cCustomer.length)
        if (cCustomer.length > 0) {
            console.log(cCustomer[0].id)
            fetchPurchaseByDate(startDate.toDateString(), endDate.toDateString(), cCustomer[0].id);
        }
        else {
            fetchPurchaseByDate(startDate.toDateString(), endDate.toDateString(), "0");
        }
        fetchPurchaseByDateSummary(startDate.toDateString(), endDate.toDateString());
    }

    const selectInvoice = (item) => {
        console.log("Select Invoice clicked");
        console.log(item.id);

        console.log(`customer id = ${item.supplierId}`)
        setSupplier({
            name: item.suppliers.name,
            address: item.suppliers.address
        })
        // const { fetchUserByInputAsync } = this.props;
        //this.props.fetchUserByInputAsync(item.supplierId);

        fetchPurchaseInvoiceDetailAsync(item.id);
    }


    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "customerSearch") {
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
    }

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

            <h1>Purchase Report</h1>
            <form onSubmit={handleSubmit}>

                <div>
                    Start Date
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker id="datePicker" selected={startDate} onChange={handleStartDTPicker}
                        name="startDate" dateFormat="MM/dd/yyyy" />
                </div>
                <div>
                    End Date
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker id="datePicker" selected={endDate} onChange={handleEndDTPicker}
                        name="startDate" dateFormat="MM/dd/yyyy" />
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

            {purchaseSummary?        
            <PrintPurchaseSummary data={purchaseSummary} sDate={startDate.toDateString()} eDate={endDate.toDateString()} />
            :
            ""
            }

            {purchaseData ?
                <div>
                    <div>
                        <div className="inputFormHeader"><h2>Summary Purchase Data</h2></div>
                        <div className="inputForm">
                            <div>Total Records = {totalSaleRecord}</div>
                            <div>Total Item = {totalSaleItem}</div>
                            <div>Total Invoice Value = {totalSaleInvVal}</div>

                        </div>
                    </div>
                    <h3>purchase View</h3>
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
            {purchaseInvoiceDetailData ?
                <div>
                    <h3>Purchase Invoice Detail View</h3>
                    <table id='returnTBL' border='1'>

                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Date</th>
                                <th>Purchase Id</th>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseInvoiceDetailData.map((item, index) => (
                                //   console.log(item);
                                <tr key={index}
                                // onClick={() => this.selectInvoice(item)}
                                >
                                    <td>{item.id}</td>
                                    <td>{item.createdAt}</td>
                                    <td>{item.purchaseInvoiceId}</td>
                                    <td>{item.items.name}</td>
                                    <td>{parseFloat(item.price).toFixed(3)}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                    <PdfInvoice invoice={purchaseInvoiceDetailData} customer={supplier} />
                </div>

                :
                ""
            }
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.user.user.user,
    purchaseData: state.purchase.purchase,
    purchaseSummary : state.purchase.purchaseSummary,
    purchaseInvoiceDetailData: state.purchase.purchaseInvoiceDetail,
    userData: state.user.users
})

const mapDispatchToProps = dispatch => ({
    fetchPurchaseByDate: (sDate, eDate, id) => dispatch(fetchPurchaseByDate(sDate, eDate, id)),
    fetchPurchaseByDateSummary :(sDate,eDate) => dispatch(fetchPurchaseByDateSummary(sDate, eDate)),
    fetchPurchaseInvoiceDetailAsync: (invoiceId) => dispatch(fetchPurchaseInvoiceDetailAsync(invoiceId)),
    fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),
    fetchUserStartAsync: () => dispatch(fetchUserStartAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseReport);
