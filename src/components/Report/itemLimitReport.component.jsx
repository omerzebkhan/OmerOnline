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

    
    const handleChange = event => {
        console.log(event.target.value);
        if (event.target.value === 'lowerlimit') {
            setFilteredOptionsItem(itemLimit.filter(
                (option) => option.quantity <= option.lowerlimit
            ));
        }
        else if (event.target.value === 'higherlimit') {
            setFilteredOptionsItem( itemLimit.filter(
                (option) => option.quantity >= option.higherlimit
            ));
        }
        
    }

  
  

    return (
        <div className="submit-form container">

            <h1>Item Limit Report</h1>
            Filter
                    <select id="Filter" name="Filter" onChange={handleChange}>
                        <option selected="Please Select">Please Select</option>
                        <option value="lowerlimit">less than lower limit</option>
                        <option value="higherlimit">More than higher limit</option>
                    </select>
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
                                <th>Id</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Lower Limit</th>
                                <th>Higher Limit</th>
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
                                        <td>{item.lowerlimit}</td>
                                        <td>{item.higherlimit}</td>
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



export default (ItemLimitReport);
