import React, { useState, useEffect,useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';
import itemService from "../../services/item.services";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


const ItemLimitReport = ({currentUser}) => {

    const [itemLimit, setItemLimit] = useState([])
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortConfig, setSortConfig] = useState();

    const [access, setAccess] = useState(false);
    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("ITEMLIMIT REPORT", currentUser.rights));
        //console.log(`access value = ${access}`)
    }
        , []);

    useEffect(() => {
        getItemLimit();
    }, [])

    useEffect(() => {


        if (itemLimit) {
            setFilteredOptionsItem(itemLimit);
        }
    }, [itemLimit])




    const getItemLimit = () => {

        itemService.getItemlimitReport()
            .then(response2 => {
                setItemLimit(response2.data)
                console.log(response2.data)
            })
            .catch(e => {
                console.log(`get Item Limit Report error ${e}`);
            })
    }


    const requestSort = async (key, type) => {

        console.log('sorting function')
        console.log(type)
        if (sortConfig === 'ascending') {
            setSortConfig('descending');
        }
        else {
            setSortConfig('ascending');
        }
        //sort base on the key and sortcofig

        var arr = itemLimit;

        function sortByKey(a, b) {

            if ((type === 'Float' ? parseFloat(a[key]) : a[key]) < (type === 'Float' ? parseFloat(b[key]) : b[key])) {
                return sortConfig === 'ascending' ? -1 : 1;
            }
            if ((type === 'Float' ? parseFloat(a[key]) : a[key]) > (type === 'Float' ? parseFloat(b[key]) : b[key])) {
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
                                <th onClick={() => requestSort('id', 'Float')}>Id</th>
                                <th onClick={() => requestSort('name', 'Text')}>Item Name</th>
                                <th onClick={() => requestSort('quantity', 'Float')}>Quantity</th>
                                <th onClick={() => requestSort('totalsale', 'Float')}>Total Sale</th>
                                <th onClick={() => requestSort('totalsale30days', 'Float')}>30 Days</th>
                                <th onClick={() => requestSort('totalsale90days', 'Float')}>90 Days</th>
                                <th onClick={() => requestSort('totalsale180days', 'Float')}>180 Days</th>
                                <th onClick={() => requestSort('totalsale365days', 'Float')}>365 Days</th>
                                <th>Order Quantity</th>
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
                                        <td>
                                            {item.quantity > item.totalsale30days ? 0 :
                                                (item.totalsale30days > 0 && item.quantity <= item.totalsale30days ? item.totalsale30days - item.quantity :
                                                    (item.totalsale90days > 0 && item.quantity <= item.totalsale90days ? item.totalsale90days - item.quantity :
                                                        (item.totalsale180days > 0 && item.quantity <= item.totalsale180days ? item.totalsale180days - item.quantity :
                                                            (item.totalsale365days > 0 && item.quantity <= item.totalsale365days ? item.totalsale365days - item.quantity : "No match found")))) }</td>

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
    currentUser: state.user.user.user
})


export default connect(mapStateToProps)(ItemLimitReport);
