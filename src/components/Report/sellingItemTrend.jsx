import React, { useState, useEffect } from 'react';
//import { connect } from 'react-redux';

//import { fetchStockStartAsync } from '../../redux/stock/stock.action';
//import { fetchItemStartAsync } from '../../redux/item/item.action';
//import { setMessage } from '../../redux/user/user.action';
import itemService from "../../services/item.services";
import DatePicker from "react-datepicker";

//import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const SellingItemTrend = () => {


    const [itemTrend, setItemTrend] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [sortConfig, setSortConfig] = useState();



    const handleStartDTPicker = (date) => { setStartDate(date); }

    const handleEndDTPicker = (date) => { setEndDate(date); }
    const handleSubmit = event => {
        event.preventDefault();
        getItemTrend();

    }

    const requestSort = (key,type) => {
        console.log('sorting function')
        console.log(type)
        if (sortConfig === 'ascending' ) {
          setSortConfig('descending');
        }
        else
        {
            setSortConfig('ascending');
        }
        //sort base on the key and sortcofig

        var arr = itemTrend;

        function sortByKey(a, b) {

            if ((type ==='Float' ? parseFloat(a[key]) : a[key])  < (type ==='Float' ? parseFloat(b[key]): a[key])) {
                return sortConfig === 'ascending' ? -1 : 1;
              }
              if ((type ==='Float' ? parseFloat(a[key]): a[key]) > (type ==='Float' ? parseFloat(b[key]): a[key])) {
                return sortConfig === 'ascending' ? 1 : -1;
              }
              return 0;
            }
            
  
          const sorted = arr.sort(sortByKey);
          //        console.log(sorted);
        console.log(sorted)
          setItemTrend(sorted);


      };
    
     


    const getItemTrend = () => {

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
                    <DatePicker id="datePicker" selected={startDate} onChange={handleStartDTPicker}
                        name="startDate" dateFormat="MM/dd/yyyy" />
                </div>
                <div>
                    End Date
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker id="datePicker" selected={endDate} onChange={handleEndDTPicker}
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
                                <th onClick={() => requestSort('totalpurchase','Float')}>Total Purchase</th>
                                <th onClick={() => requestSort('totalsale','Float')}>Total Sale</th>
                                <th onClick={() => requestSort('saleprice','Float')}>Sale price</th>
                                <th onClick={() => requestSort('cost','Float')}>Cost</th>
                                <th onClick={() => requestSort('profit','Float')}>Profit</th>
                                <th onClick={() => requestSort('name','Text')}>Name</th>
                                <th onClick={() => requestSort('averageprice','Float')}>Average Price</th>
                                <th onClick={() => requestSort('quantity','Float')}>Quantity</th>

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
                                        <td>{item.quantity}</td>
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
