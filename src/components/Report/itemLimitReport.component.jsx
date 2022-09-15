import React, { useState, useEffect } from 'react';
//import { connect } from 'react-redux';

//import { fetchStockStartAsync } from '../../redux/stock/stock.action';
//import { fetchItemStartAsync } from '../../redux/item/item.action';
//import { setMessage } from '../../redux/user/user.action';
import itemService from "../../services/item.services";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


const ItemLimitReport = () => {
    
    const [itemLimit,setItemLimit]= useState([])
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortConfig, setSortConfig] = useState();

    useEffect(() => {
        getItemLimit();
    }, [])

    useEffect(() => {

      
        if (itemLimit) {
            setFilteredOptionsItem(itemLimit);
        }
    }, [itemLimit])


   
   
    const getItemLimit = () =>{
        
        itemService.getItemlimitReport()
        .then(response2 => {
            setItemLimit(response2.data)
        })
        .catch(e => {
            console.log(`get Item Limit Report error ${e}`);
        })
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

        var arr = itemLimit;

        function sortByKey(a, b) {

            if ((type ==='Float' ? parseFloat(a[key]) : a[key])  < (type ==='Float' ? parseFloat(b[key]): b[key])) {
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

    
    // const handleChange = event => {
    //     console.log(event.target.value);
    //     if (event.target.value === 'lowerlimit') {
    //         setFilteredOptionsItem(itemLimit.filter(
    //             (option) => option.quantity <= option.lowerlimit
    //         ));
    //     }
    //     else if (event.target.value === 'higherlimit') {
    //         setFilteredOptionsItem( itemLimit.filter(
    //             (option) => option.quantity >= option.higherlimit
    //         ));
    //     }
        
    // }

  
  

    return (
        <div className="submit-form container">

            <h1>Item Limit Report</h1>
            {/* Filter
                    <select id="Filter" name="Filter" onChange={handleChange}>
                        <option selected="Please Select">Please Select</option>
                        <option value="lowerlimit">less than lower limit</option>
                        <option value="higherlimit">More than higher limit</option>
                    </select> */}
                    <div>
                        <ReactHTMLTableToExcel
                            className="btn btn-info"
                            table="itemLimitView"
                            filename="LimitReportExcel"
                            sheet="Sheet"
                            buttonText="Limit Report Excel" />
                    </div>
 
            {filteredOptionsItem ?
                <div>
                    
                    <table border='1' id="itemLimitView">

                        <thead>
                            <tr>
                            <th onClick={() => requestSort('id','Float')}>Id</th>
                            <th onClick={() => requestSort('name','Text')}>Item Name</th>
                            <th onClick={() => requestSort('quantity','Text')}>Quantity</th>
                            <th onClick={() => requestSort('totalsale','Text')}>Total Sale</th>
                            <th onClick={() => requestSort('totalsale30days','Text')}>30 Days</th>
                            <th onClick={() => requestSort('totalsale90days','Text')}>90 Days</th>
                            <th onClick={() => requestSort('totalsale180days','Text')}>180 Days</th>
                            <th onClick={() => requestSort('totalsale365days','Text')}>365 Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredOptionsItem.map((item, index) => (
                                    //   console.log(item);
                                    <tr key={index}
                                    //onClick={() => setActiveBrand(item, index)}
                                    >
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.totalsale}</td>
                                        <td>{item.totalsale30days}</td>
                                        <td>{item.totalsale90days}</td>
                                        <td>{item.totalsale180days}</td>
                                        <td>{item.totalsale365days}</td>
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



export default (ItemLimitReport);
