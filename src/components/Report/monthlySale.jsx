import React, { useState, useEffect } from 'react';

import itemService from "../../services/item.services";
import DatePicker from "react-datepicker";
import inventoryService from '../../services/inventory.service';


//import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const MonthlySale = () => {

    const [saleMonthly, setSaleMonthly] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [sortConfig, setSortConfig] = useState();
    const [itemInput, setItemInput] = useState("");
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);



    const handleStartDTPicker = (date) => { setStartDate(date); }

    const handleEndDTPicker = (date) => { setEndDate(date); }
    const handleSubmit = event => {
        event.preventDefault();
        getMonthlySale();

    }

    const  requestSort = async (key,type) => {
   
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

        var arr = saleMonthly;

        function sortByKey(a, b) {

            if ((type ==='Float' ? parseFloat(a[key]) : a[key])  < (type ==='Float' ? parseFloat(b[key]): [key])) {
                return sortConfig === 'ascending' ? -1 : 1;
              }
              if ((type ==='Float' ? parseFloat(a[key]): a[key]) > (type ==='Float' ? parseFloat(b[key]): b[key])) {
                return sortConfig === 'ascending' ? 1 : -1;
              }
              return 0;
            }
            
  
          const sorted = arr.sort(sortByKey);
          //        console.log(sorted);
        console.log(sorted)
          setFilteredOptionsItem(sorted);


      };
    
     


    const getMonthlySale = () => {

        inventoryService.getMonthlySale(startDate.toDateString(), endDate.toDateString())
            .then(response2 => {
                saleMonthly(response2.data)
                setFilteredOptionsItem(response2.data)
            })
            .catch(e => {
                console.log(`get Item Trend Report error ${e}`);
            })
    }


   




    return (
        <div className="submit-form container">

            <h1>Monthly Sale Report</h1>
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
                <div className="form-group">
                    <label htmlFor="Name">Item Name</label>
                    <input
                        type="text"
                        name="Name"
                        id="Name"
                        placeholder="Name"
                        value={itemInput}
                        onChange={handleChange} />
                </div>
            </form>
            {filteredOptionsItem ?
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
                                filteredOptionsItem.map((item, index) => (
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



export default (MonthlySale);
