import React, { useState, useEffect,useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import { fetchSaleReturnByDate,fetchSaleReturnDetail } from '../../redux/Sale/sale.action';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const ReturnReport = ({
    fetchSaleReturnByDate,saleReturnData,
    fetchSaleReturnDetail,saleReturnDetailData,currentUser
}) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [nameInput, setNameInput] = useState("");

    const [totalSaleRecord,setTotalSaleRecord] = useState([0]);
    const [totalSaleItem,setTotalSaleItem] = useState(0);
    
    const [access, setAccess] = useState(false);
    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("SALERETURN REPORT", currentUser.rights));
        //console.log(`access value = ${access}`)
    }
        , []);
    
  
    useEffect(() => {
        if (saleReturnData){ 
        var sumQuantity = 0
        var sumRecord = 1
        saleReturnData.map((item, index) =>{
            sumQuantity = sumQuantity + parseInt(item.quantity)
            setTotalSaleItem(sumQuantity)
            sumRecord = index + 1
            setTotalSaleRecord(sumRecord)
        })}
    }, [saleReturnData])


    const handleChange = event => {

        if (event.target.id === "Name") {
            setNameInput(event.target.value);
        }
    }

    const handleStartDTPicker = (date) => {
        setStartDate(date);
    }

    const handleEndDTPicker = (date) => {
        setEndDate(date);
    }

    const handleSubmit = event => {
        event.preventDefault();
        console.log(startDate)
        if (nameInput==="" && (startDate!==null||endDate!==null)){
            fetchSaleReturnByDate("0",startDate.toDateString(), endDate.toDateString());
        }
        else if (nameInput!=="" && (startDate===null||endDate===null)){
            
            fetchSaleReturnByDate(nameInput,"0", "0");
        }
        else if (nameInput!=="" && (startDate!==null||endDate!==null))
        {
            fetchSaleReturnByDate(nameInput,startDate.toDateString(), endDate.toDateString());
        }
        
    }

    const selectInvoice = (item) => {
        console.log("Select Invoice clicked");
        // fetchUserByInputAsync(item.customerId);
        fetchSaleReturnDetail(item.saleInvoiceId);    
    }

    return (
        <div className="submit-form container">
            <h1>Sale Return Report</h1>
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
                    <div className="col-sm-12">
                    <input
                                    type="text"
                                    name="Name"
                                    id="Name"
                                    placeholder="Customer Name"
                                    value={nameInput}
                                    onChange={handleChange} />
                    </div>
                    
                </div>

                <div >
                    <button className="btn btn-success" type="submit" >Search</button>

                </div>
            </form>

           { saleReturnData ?
               <div>
                   <div>
                    <div className="inputFormHeader"><h2>Summary Return Data</h2></div>
                    <div className="inputForm">
                    <div>Total Records = {totalSaleRecord}</div>    
                    <div>Total Item = {totalSaleItem}</div>
                    </div>
                </div>
               <div>
                    
                    <h3>Return View</h3>
                    <table border='1'>
                        <thead>
                            <tr>
                                <th>Sale Invoice</th>
                                <th>Quantity</th>
                                <th>Customer Name</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {   
                                saleReturnData.map((item, index) => (
                                    console.log(item),
                                    <tr key={index}
                                        onClick={() => selectInvoice(item)}
                                    >
                                        <td>{item.saleInvoiceId}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.name}</td>
                                        <td>{item.cAt}</td>
                                        
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

{saleReturnDetailData ?
                <div>
                    <h3>Sale Retutn Invoice Detail View</h3>
                    <table id='returnTBL' border='1'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Sale Invoice Id</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            { saleReturnDetailData.map((item, index) => (
                                    // console.log(item),
                                    <tr key={index}
                                       // onClick={() => editInvoceHandler(item)}
                                    >
                                        <td>{item.id}</td>
                                        <td>{item.saleInvoiceId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
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
         
           
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    user: state.user.users,
    saleReturnData: state.sale.saleReturn,
    saleReturnDetailData: state.sale.saleReturnDetail,
    userData: state.user.users
})

const mapDispatchToProps = dispatch => ({
    fetchSaleReturnByDate: (custName,sDate,eDate) => dispatch(fetchSaleReturnByDate(custName,sDate, eDate)),
    fetchSaleReturnDetail: (invoiceId) => dispatch(fetchSaleReturnDetail(invoiceId))
    

});

export default connect(mapStateToProps, mapDispatchToProps)(ReturnReport);

