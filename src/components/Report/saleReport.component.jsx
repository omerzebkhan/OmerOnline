import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// import inventoryService from "../../services/inventory.service";
// import userService from "../../services/user.service";
// import itemService from "../../services/item.services";
import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchSaleByDate, fetchSaleInvoiceDetailAsync,fetchSaleByDateSummary } from '../../redux/Sale/sale.action';
import { fetchUserByInputAsync, fetchUserStartAsync } from '../../redux/user/user.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import PdfInvoice from "./printInvoice";
import PrintSaleSummary from './printSaleSummary';

const SaleReport = ({
    fetchUserStartAsync, userData,
    fetchItemStartAsync, itemData,
    fetchSaleByDate,saleData,
    fetchSaleInvoiceDetailAsync,saleInvoiceDetailData,
     fetchUserByInputAsync,user,
    currentUser,
    fetchSaleByDateSummary,saleSummary
}) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [totalSaleRecord,setTotalSaleRecord] = useState([0]);
    const [totalSaleItem,setTotalSaleItem] = useState(0);
    const [totalSaleInvVal,setTotalSaleInvVal] = useState(0);
    const [totalSaleProfit,setTotalSaleProfit] = useState(0);
    const [invoiceNo,setInvoiceNo]=useState("");

    const [cCustomer, setcCustomer] = useState([]);
    const [customerInput, setCustomerInput] = useState("");
    const [activeOptionCustomer, setActiveOptionCustomer] = useState("");
    const [showOptionsCustomer, setShowOptionsCustomer] = useState(false);
    const [filteredOptionsCustomer, setFilteredOptionsCustomer] = useState([]);

    const [cAgent, setcAgent] = useState([]);
    const [agentInput, setAgentInput] = useState("");
    const [activeOptionAgent, setActiveOptionAgent] = useState("");
    const [showOptionsAgent, setShowOptionsAgent] = useState(false);
    const [filteredOptionsAgent, setFilteredOptionsAgent] = useState([]);

    const [filteredSale,setFilteredSale]=useState([]);




    useEffect(() => {
        fetchUserStartAsync();
    }, [fetchUserStartAsync])

  

    useEffect(() => {
        if (filteredSale){ 
        var sumQuantity = 0
        var sumRecord = 1
        var sumInvValue = 0
        var sumProfit =0
        filteredSale.map((item, index) =>{
            sumQuantity = sumQuantity + parseInt(item.totalitems)
            setTotalSaleItem(sumQuantity)
            sumRecord = index + 1
            setTotalSaleRecord(sumRecord)
            sumInvValue = sumInvValue + (item.invoicevalue)
            setTotalSaleInvVal(parseFloat(sumInvValue).toFixed(3))
            sumProfit = sumProfit + (item.profit)
            setTotalSaleProfit(parseFloat(sumProfit).toFixed(3))
        })}
    }, [filteredSale])


    useEffect(() => {
        setFilteredSale(saleData)
    }, [saleData])


    const handleStartDTPicker = (date) => {
        setStartDate(date);
    }

    const handleEndDTPicker = (date) => {
        setEndDate(date);
    }

    const handleSubmit = event => {
        event.preventDefault();
        //console.log(cAgent[0].id)
      if(invoiceNo==""){
      if (cCustomer.length > 0 && cAgent.length > 0 ) {
            fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), cCustomer[0].id,cAgent[0].id,"0","0");
        }
        else if (cCustomer.length > 0){
            fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), cCustomer[0].id,"0","0","0");
        }
        else if (cAgent.length > 0){
            fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), "0", cAgent[0].id,"0","0");
        }
        else {
            fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), "0","0","0","0");
        }
        fetchSaleByDateSummary(startDate.toDateString(), endDate.toDateString());
    }
    else
    {
        fetchSaleInvoiceDetailAsync(invoiceNo);  
        //clear all other options
        //should be fixed by setting data in array and resetting the array
        setFilteredSale("")

    }
    }

    const selectInvoice = (item) => {
        console.log("Select Invoice clicked");
       // console.log(item.id);
       // console.log(`customer id = ${item.customerId}`)
       
        // const { fetchUserByInputAsync } = this.props;
        fetchUserByInputAsync(item.customerId);
        fetchSaleInvoiceDetailAsync(item.saleInvoiceId);


        
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
        else if (event.target.id === "agentSearch") {
            setFilteredOptionsAgent(userData.user.filter(
                (option) => option.name.toLowerCase().indexOf(agentInput.toLowerCase()) > -1
                    && option.roles.toUpperCase() === "SALEAGENT"
            ));
            setActiveOptionAgent(0);
            setShowOptionsAgent(true);
            //setCustomerInput(customerInput);
            setAgentInput(event.target.value);
        }
        else if (event.target.id === "invoiceNo"){
            setInvoiceNo(event.target.value);
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

        // console.log(`selecte customer id = ${e.currentTarget.dataset.id}`);
        // console.log(`user data${userData.user[0].id}`);
        const selectedCustomer = userData.user.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );

        setCustomerInput(selectedCustomer[0].name);
        setcCustomer(selectedCustomer);

        // console.log(cItem[0].name)
    };
    let optionListCustomer;
    if (showOptionsCustomer && customerInput) {
        // console.log(filteredOptionsCustomer);
        // console.log(filteredOptionsCustomer.length)
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

//////////////////////////////////////////////////////////////////////
    /////////////////////////// Drop down logic for Agent 
    const onKeyDownAgent = (e) => {
        //console.log("On change is fired")
        // const { activeOption, filteredOptions } = this.props;
        if (e.keyCode === 13) {
            setActiveOptionAgent(0);
            setShowOptionsAgent(false);
            setAgentInput(filteredOptionsAgent[activeOptionAgent]);
        } else if (e.keyCode === 38) {
            if (activeOptionAgent === 0) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionAgent(activeOptionAgent - 1)
        } else if (e.keyCode === 40) {
            if (activeOptionAgent - 1 === filteredOptionsAgent.length) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionAgent(activeOptionAgent + 1)
        }
    };
    const onClickAgent = (e) => {
        setActiveOptionAgent(0);
        setFilteredOptionsAgent([]);
        setShowOptionsAgent(false);

        // console.log(e.currentTarget.dataset.id);
        // console.log(itemData);
        const selectedAgent = userData.user.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        setAgentInput(selectedAgent[0].name);
        setcAgent(selectedAgent);

        // console.log(cItem[0].name)
    };
    let optionListAgent;
    if (showOptionsAgent && agentInput) {
        // console.log(filteredOptionsAgent);
        // console.log(filteredOptionsAgent.length)
        if (filteredOptionsAgent.length) {
            optionListAgent = (
                <ul className="options">
                    {filteredOptionsAgent.map((optionName, index) => {
                        let className;
                        if (index === activeOptionAgent) {
                            className = 'option-active';
                        }
                        return (
                            <li key={optionName.id} className={className} data-id={optionName.id} onClick={onClickAgent}>
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
            optionListAgent = (
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
                <div className="form-group row">
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Agent Name</label>
                            </div>
                            <div className="col-sm-2">   
                                <input
                                    type="text"
                                    name="agentSearch"
                                    id="agentSearch"
                                    placeholder="Select Agent"
                                    value={agentInput}
                                    onChange={handleChange}
                                    onKeyDown={onKeyDownAgent}
                                />
                            </div>
                            
                            <div className="col-sm-2">    
                                <input
                                    type="text"
                                    name="Agent"
                                    id="Agnet"
                                    placeholder="Select Agent"
                                    value={cAgent[0] ? cAgent[0].id : "" }
                                    disabled />
                            </div>
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    name="Agent Address"
                                    id="agentAddress"
                                    placeholder="Address"
                                    value={cAgent[0] ? cAgent[0].address : ""}
                                    disabled />
                            </div>
                            <div>
                                {optionListAgent}
                            </div>

                        </div>
                        <div className="form-group row">
                            <div className="col-sm-2">
                                <label className="col-form-label" htmlFor="Item">Inovce No.</label>
                            </div>
                            <div className="col-sm-2">   
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    id="invoiceNo"
                                    placeholder="InvoiceNo"
                                    value={invoiceNo}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                <div >
                    <button className="btn btn-success" type="submit" >Search</button>

                </div>
            </form>

            {saleSummary && filteredSale?        
            <PrintSaleSummary data={saleSummary} sDate={startDate.toDateString()} eDate={endDate.toDateString()} />
            :
            ""
            }

            { filteredSale ?
               <div>
                   <div>
                    <div className="inputFormHeader"><h2>Summary Sale Data</h2></div>
                    <div className="inputForm">
                    <div>Total Records = {totalSaleRecord}</div>    
                    <div>Total Item = {totalSaleItem}</div>
                    <div>Total Invoice Value = {totalSaleInvVal}</div>
                    <div>Total profit = {totalSaleProfit} </div>
                    </div>
                </div>
               <div>
                    
                    <h3>Sale View</h3>
                    <table border='1'>
                        <thead>
                            <tr>
                                <th>Reff Invoice</th>
                                <th>Customer Name</th>
                                <th>Sale Agent</th>
                                <th>Total Items</th>
                                <th>Invoice Value</th>
                                <th>Profit</th>
                                <th>Date Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {   
                                filteredSale.map((item, index) => (
                                    console.log(item),
                                    <tr key={index}
                                        onClick={() => selectInvoice(item)}
                                    >
                                        <td>{item.saleInvoiceId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.agentname}</td>
                                        <td>{item.totalitems}</td>
                                        <td>{item.invoicevalue}</td>
                                        <td>{parseFloat(item.profit).toFixed(3)}</td>
                                        <td>{item.date}</td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
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
                                        <td>{item.itemname}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.cost}</td>
                                        <td>{parseFloat((item.price*item.quantity)-(item.cost * item.quantity)).toFixed(3)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <PdfInvoice invoice={saleInvoiceDetailData} />
         
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
    saleSummary : state.sale.saleSummary,
    saleInvoiceDetailData: state.sale.saleInvoiceDetail,
    userData: state.user.users
})

const mapDispatchToProps = dispatch => ({
    fetchSaleByDate: (sDate, eDate, id, id1) => dispatch(fetchSaleByDate(sDate, eDate, id,id1)),
    fetchSaleByDateSummary :(sDate,eDate) => dispatch(fetchSaleByDateSummary(sDate, eDate)),
    fetchSaleInvoiceDetailAsync: (invoiceId) => dispatch(fetchSaleInvoiceDetailAsync(invoiceId)),
    fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),
    fetchUserStartAsync: () => dispatch(fetchUserStartAsync()),
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync())

});

export default connect(mapStateToProps, mapDispatchToProps)(SaleReport);
