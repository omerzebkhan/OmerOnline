import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// import inventoryService from "../../services/inventory.service";
// import userService from "../../services/user.service";
// import itemService from "../../services/item.services";
//import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchSaleReturnByDate,fetchSaleReturnDetail } from '../../redux/Sale/sale.action';
//import { fetchUserByInputAsync, fetchUserStartAsync } from '../../redux/user/user.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const ReturnReport = ({
    fetchSaleReturnByDate,saleReturnData,
    fetchSaleReturnDetail,saleReturnDetailData
}) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [totalSaleRecord,setTotalSaleRecord] = useState([0]);
    const [totalSaleItem,setTotalSaleItem] = useState(0);
    

    
  
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



    const handleStartDTPicker = (date) => {
        setStartDate(date);
    }

    const handleEndDTPicker = (date) => {
        setEndDate(date);
    }

    const handleSubmit = event => {
        event.preventDefault();
        fetchSaleReturnByDate(startDate.toDateString(), endDate.toDateString());
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
    user: state.user.users,
    saleReturnData: state.sale.saleReturn,
    saleReturnDetailData: state.sale.saleReturnDetail,
    userData: state.user.users
})

const mapDispatchToProps = dispatch => ({
    fetchSaleReturnByDate: (sDate, eDate) => dispatch(fetchSaleReturnByDate(sDate, eDate)),
    fetchSaleReturnDetail: (invoiceId) => dispatch(fetchSaleReturnDetail(invoiceId))
    

});

export default connect(mapStateToProps, mapDispatchToProps)(ReturnReport);

