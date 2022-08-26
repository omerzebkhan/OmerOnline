import React, { useState, useEffect } from 'react';
//import { connect } from 'react-redux';

//import { fetchStockStartAsync } from '../../redux/stock/stock.action';
//import { fetchItemStartAsync } from '../../redux/item/item.action';
//import { setMessage } from '../../redux/user/user.action';
import itemService from "../../services/item.services";
import DatePicker from "react-datepicker";

//import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const SellingItemTrend = () => {
    
    const [itemTrend,setItemTrend]= useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

  

    const handleStartDTPicker = (date) => { setStartDate(date); }

    const handleEndDTPicker = (date) => { setEndDate(date);  }
    const  handleSubmit = event => {
        event.preventDefault();
       getItemTrend ();
       
    }

   
    const getItemTrend = () =>{
        
        itemService.getItemTrend(startDate.toDateString(), endDate.toDateString())
        .then(response2 => {
            setItemTrend(response2.data)
        })
        .catch(e => {
            console.log(`get Item Trend Report error ${e}`);
        })
    }

    
    

  
  

    return (
        <div className="submit-form container">

            <h1>Item Trend Report</h1>
            <form onSubmit={handleSubmit}>
            <div>
               
                    Start Date    
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker id = "datePicker" selected={startDate} onChange={handleStartDTPicker}
                      name="startDate" dateFormat="MM/dd/yyyy"/>
                    </div>
                    <div>
                    End Date    
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker id = "datePicker" selected={endDate} onChange={handleEndDTPicker }
                      name="startDate" dateFormat="MM/dd/yyyy" />
                    </div>
                    <div >
                        <button className="btn btn-success" type="submit" >Search</button>
                    </div>
                    </form>
            {itemTrend ?
                <div>
                    
                    <table border='1' id="itemLimitView">

                        <thead>
                            <tr>
                                <th>Total Purchase</th>
                                <th>Total Sale</th>
                                <th>Sale price</th>
                                <th>Cost</th>
                                <th>Profit</th>
                                <th>Name</th>
                                <th>Average Price</th>

                            </tr>
                        </thead>

                        <tbody>


                            {
                                itemTrend.map((item, index) => (
                                    //   console.log(item);

                                    <tr key={index}
                                    //onClick={() => setActiveBrand(item, index)}
                                    >
                                        <td>{item.totalpurchase}</td>
                                        <td>{item.totalsale}</td>
                                        <td>{parseFloat(item.saleprice).toFixed(3)}</td>
                                        <td>{parseFloat(item.cost).toFixed(3)}</td>
                                        <td>{parseFloat(item.profit).toFixed(3)}</td>
                                        <td>{item.name}</td>
                                        <td>{item.averageprice}</td>
                                    </tr>
                                )
                                )

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



export default (SellingItemTrend);
