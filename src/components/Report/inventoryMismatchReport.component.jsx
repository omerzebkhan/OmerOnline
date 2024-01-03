import React, { useState, useEffect,useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Collapse } from 'react-bootstrap'

//import { fetchStockStartAsync } from '../../redux/stock/stock.action';
import { fetchInventoryMismatchAsync } from '../../redux/item/item.action';

import { setMessage } from '../../redux/user/user.action';
import itemService from "../../services/item.services";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const InventoryMismatchReport = ({
    fetchInventoryMismatchAsync, itemData,
    isFetching,currentUser }) => {
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);
    const [access, setAccess] = useState(false);
    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("STOCK REPORT", currentUser.rights));
        //bypass authentication
        setAccess("True");
        //console.log(`access value = ${access}`)
    }
        , []);

    useEffect(() => {
        fetchInventoryMismatchAsync();
    }, [fetchInventoryMismatchAsync])


    useEffect(() => {

        function sortById(a, b) {
            return a.id - b.id;
        }
        if (itemData) {
            const sorted = itemData.sort(sortById);
            setFilteredOptionsItem(sorted);
        }
    }, [itemData])


         
   

    return (
        <div className="submit-form container">

            <h1>Inventory Mismatch Report</h1>
            <form >
                <div className="form-group">
                   
                    <div>
                        <ReactHTMLTableToExcel
                            className="btn btn-info"
                            table="stockView"
                            filename="ReportExcel"
                            sheet="Sheet"
                            buttonText="Export excel" />
                    </div>
                </div>

            </form>
            {isFetching ?
                <div>"Loading data ....."</div> :
                ""}
            

            {filteredOptionsItem ?
                <div>
                    <h3>Inventory Mismatch View</h3>
                    <table border='1' id="stockView">

                        <thead>
                            <tr>
                                <th>Item Id</th>
                                <th>Item Name</th>
                                <th>Current Stock</th>
                                <th>Total purchase</th>
                                <th>Total Sale</th>
                                <th>sale - purchase</th>
                                <th>Difference</th>
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
                                        <td>{item.totalpurchase}</td>
                                        <td>{item.totalsale}</td>
                                        <td>{item.totalsale-item.totalpurchase}</td>
                                        <td>{item.diff}</td>
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

const mapStateToProps = state => ({
    currentUser: state.user.user.user,
    itemData: state.item.inventoryMismatch,
    isFetching: state.item.isFetching
})

const mapDispatchToProps = dispatch => ({
    fetchInventoryMismatchAsync: () => dispatch(fetchInventoryMismatchAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(InventoryMismatchReport);
