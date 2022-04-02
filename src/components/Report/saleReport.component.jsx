import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import inventoryService from "../../services/inventory.service";
import userService from "../../services/user.service";
import itemService from "../../services/item.services";
import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchSaleByDate, fetchSaleInvoiceDetailAsync } from '../../redux/Sale/sale.action';
import { fetchUserByInputAsync, fetchUserStartAsync } from '../../redux/user/user.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import PdfInvoice from "./printInvoice"

const SaleReport = ({
    fetchUserStartAsync, userData,
    fetchItemStartAsync, itemData,
    fetchSaleByDate,
    fetchSaleInvoiceDetailAsync, fetchUserByInputAsync,
    currentUser,
    saleData, saleInvoiceDetailData, user
}) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);



    const [cCustomer, setcCustomer] = useState([]);
    const [customerInput, setCustomerInput] = useState("");
    const [activeOptionCustomer, setActiveOptionCustomer] = useState("");
    const [showOptionsCustomer, setShowOptionsCustomer] = useState(false);
    const [filteredOptionsCustomer, setFilteredOptionsCustomer] = useState([]);


    useEffect(() => {
        fetchUserStartAsync();
    }, [fetchUserStartAsync])

  



    const handleStartDTPicker = (date) => {
        setStartDate(date);
    }

    const handleEndDTPicker = (date) => {
        setEndDate(date);
    }

    const handleSubmit = event => {
        event.preventDefault();
        console.log(cCustomer.length)
        if (cCustomer.length > 0) {
            fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), cCustomer[0].id);
        }
        else {
            fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), "0");
        }

    }

    const selectInvoice = (item) => {
        console.log("Select Invoice clicked");
       // console.log(item.id);
       // console.log(`customer id = ${item.customerId}`)
       
        // const { fetchUserByInputAsync } = this.props;
        fetchUserByInputAsync(item.customerId);
        fetchSaleInvoiceDetailAsync(item.id);


        
    }



    const handleChange = event => {
        //console.log(event);
       if (event.target.id === "customerSearch") {
            console.log(`customer input=${customerInput} ${event.target.value}`)
            if (userData.user) {
                setFilteredOptionsCustomer(userData.user.filter(
                    // console.log(userData[0].name)
                    (option) =>
                        option.name.toLowerCase().indexOf(customerInput.toLowerCase()) > -1 && option.roles.toUpperCase() === "CUSTOMER"
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
            <h1>Sale Report</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group row">
                    <div className="col-sm-3">
                        Start Date
                        <DatePicker id="datePicker" selected={startDate} onChange={handleStartDTPicker}
                        name="startDate" dateFormat="MM/dd/yyyy" />
                    </div>
                    <div className="col-sm-3">
                        End Date
                        <DatePicker id="datePicker" selected={endDate} onChange={handleEndDTPicker}
                            name="startDate" dateFormat="MM/dd/yyyy" />
                    </div>
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

            { saleData ?
                <div>
                    <h3>Sale View</h3>
                    <table border='1'>
                        <thead>
                            <tr>
                                <th>Reff Invoice</th>
                                <th>Customer Name</th>
                                <th>Total Items</th>
                                <th>Invoice Value</th>
                                <th>Date Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {   
                                saleData.map((item, index) => (
                                    console.log(item),
                                    <tr key={index}
                                        onClick={() => selectInvoice(item)}
                                    >
                                        <td>{item.id}</td>
                                        <td>{item.customers.name}</td>
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
                                <th>Cost</th>
                                <th>profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            { saleInvoiceDetailData.map((item, index) => (
                                    // console.log(item),
                                    <tr key={index}
                                       // onClick={() => editInvoceHandler(item)}
                                    >
                                        <td>{item.id}</td>
                                        <td>{item.createdAt}</td>
                                        <td>{item.saleInvoiceId}</td>
                                        <td>{item.items.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.cost}</td>
                                        <td>{parseFloat((item.price*item.quantity)-(item.cost * item.quantity)).toFixed(3)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <PdfInvoice invoice={saleInvoiceDetailData} customer={user} />
         
                </div>

                :
                ""
            }
         
        </div>
    )
}

const mapStateToProps = state => ({
    itemData: state.item.items,
    user: state.user.users,
    saleData: state.sale.sale,
    saleInvoiceDetailData: state.sale.saleInvoiceDetail,
    userData: state.user.users
})

const mapDispatchToProps = dispatch => ({
    fetchSaleByDate: (sDate, eDate, id) => dispatch(fetchSaleByDate(sDate, eDate, id)),
    fetchSaleInvoiceDetailAsync: (invoiceId) => dispatch(fetchSaleInvoiceDetailAsync(invoiceId)),
    fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),
    fetchUserStartAsync: () => dispatch(fetchUserStartAsync()),
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync())

});

export default connect(mapStateToProps, mapDispatchToProps)(SaleReport);
