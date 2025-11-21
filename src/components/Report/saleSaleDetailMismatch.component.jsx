import React, { useRef,useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Collapse } from 'react-bootstrap'

//import { fetchStockStartAsync } from '../../redux/stock/stock.action';
import { fetchInventoryMismatchAsync } from '../../redux/item/item.action';

import { setMessage } from '../../redux/user/user.action';
import inventoryService from "../../services/inventory.service";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

import { DownloadTableExcel } from "react-export-table-to-excel";

const SaleSaleDetailMismatchReport = ({
    isFetching, currentUser }) => {

    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);
    const [access, setAccess] = useState(false);
    const tableRef = useRef(null);
    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("STOCK REPORT", currentUser.rights));
        //bypass authentication
        setAccess("True");
        //console.log(`access value = ${access}`)
    }
        , []);

    useEffect(() => {
        getSaleSaleDetailMismatch();
    }, [])




    const getSaleSaleDetailMismatch = () => {

        inventoryService.getAllSaleSaleDetailMismatch()
            .then(response2 => {
                //setItemTrend(response2.data)
                setFilteredOptionsItem(response2.data)
            })
            .catch(e => {
                console.log(`get Item Trend Report error ${e}`);
            })
    }



    return (
        <div className="submit-form container">

            <h1>Sale Sale Detail Mismatch Report</h1>
            <form >
                <div className="form-group">

                    <div>
                       
                        <DownloadTableExcel
                            filename="ReportExcel"
                            sheet="Receivable"
                            currentTableRef={tableRef.current}
                        >
                            <button className="btn btn-success">Download as Excel</button>
                        </DownloadTableExcel>

                    </div>
                </div>

            </form>
            {isFetching ?
                <div>"Loading data ....."</div> :
                ""}


            {filteredOptionsItem ?
                <div>
                    <h3>Sale Sale Detail Mismatch View</h3>
                    <table border='1' id="stockView" ref={tableRef}>

                        <thead>
                            <tr>
                                <th>Sale Invoice Id</th>
                                <th>Sale Invoice Value</th>
                                <th>Sale Detail Total</th>
                                <th>Diff.</th>
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
                                        <td>{item.invoicevalue}</td>
                                        <td>{item.saledetailtotal}</td>
                                        <td>{item.invoicevalue - item.saledetailtotal}</td>
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
    isFetching: state.item.isFetching
})


export default connect(mapStateToProps)(SaleSaleDetailMismatchReport);
