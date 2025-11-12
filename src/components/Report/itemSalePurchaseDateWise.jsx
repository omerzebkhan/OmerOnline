import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import itemServices from '../../services/item.services';
import { DownloadTableExcel } from "react-export-table-to-excel";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

//class BalanceSheet extends React.Component {
const ItemSalePurchaseDateWise = ({ currentUser }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [totalPurchaseQty, setTotalPurchaseQty] = useState(0);
  const [totalPurchaseValue, setTotalPurchaseValue] = useState(0);
  const [totalSaleQty, setTotalSaleQty] = useState(0);
  const [totalSaleValue, setTotalSaleValue] = useState(0);
  const [totalSaleProfit, setTotalSaleProfit] = useState(0);

  const [itemSalePurchase, setItemSalePurchase] = useState(0);
  const [sortConfig, setSortConfig] = useState();
  const [itemInput, setItemInput] = useState("");
  const [itemList, setItemList] = useState([])

  const [access, setAccess] = useState(false);
  useLayoutEffect(() => {
    // checkAdmin().then((r) => { setContent(r); });
    setAccess(checkAccess("MonthlySale", currentUser.rights));
    //console.log(`access value = ${access}`)
  }
    , []);

  useEffect(() => {
    var sumRecord = 1
    var sumTotalQty = 0
    var sumTotalPurchaseQty = 0
    var sumTotalPurchaseValue = 0
    var sumTotalSaleQty = 0
    var sumTotalSaleValue = 0
    var sumTotalSaleProfit = 0

    if (itemSalePurchase) {
      itemSalePurchase.map((item, index) => {
        sumRecord = index + 1
        setTotalRows(sumRecord)
        sumTotalQty = sumTotalQty + item.quantity
        setTotalQty(sumTotalQty)
        sumTotalPurchaseQty = sumTotalPurchaseQty + parseInt(item.pquantity)
        setTotalPurchaseQty(sumTotalPurchaseQty)
        sumTotalPurchaseValue = sumTotalPurchaseValue + item.pvalue
        setTotalPurchaseValue(sumTotalPurchaseValue)
        sumTotalSaleQty = sumTotalSaleQty + parseInt(item.squantity)
        setTotalSaleQty(sumTotalSaleQty)
        sumTotalSaleValue = sumTotalSaleValue + item.svalue
        setTotalSaleValue(sumTotalSaleValue)
        sumTotalSaleProfit = sumTotalSaleProfit + item.sprofit
        setTotalSaleProfit(sumTotalSaleProfit)

      })
    }
  }, [itemSalePurchase])

  const handleStartDTPicker = (date) => { setStartDate(date); }

  const handleEndDTPicker = (date) => { setEndDate(date); }

  const handleChange = event => {
    //console.log(event);
    if (event.target.id === "Name") {
      setItemInput(event.target.value);

      if (event.target.value === "") {
        setItemSalePurchase(itemList);
      }
      else {
        setItemSalePurchase(itemList.filter(
          (option) => option.name.toLowerCase().indexOf(itemInput.toLowerCase()) > -1
        ));
      }
    }
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

    var arr = itemSalePurchase;

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
    setItemSalePurchase(sorted);


  };


  const handleSubmit = event => {
    event.preventDefault();


    itemServices.getSalePurchaseDateWise(startDate.toDateString(), endDate.toDateString())
      .then(response => {


        setItemSalePurchase(response.data);
        setItemList(response.data);


      })
      .catch(error => {
        //const obj = JSON.parse(error.response.request.response);
        //console.log(obj.errorMessage)
        console.log(error.response.request.response.errorMessage);

      });

  }




  return (
    <div className="submit-form container">

      <h1>Item Sale Purchase Datewise</h1>
      <form onSubmit={handleSubmit}>

        <div>
          Start Date
          <DatePicker id="datePicker" selected={startDate} onChange={handleStartDTPicker}
            name="startDate" dateFormat="MM/dd/yyyy" />

          End Date
          <DatePicker id="datePicker" selected={endDate} onChange={handleEndDTPicker}
            name="startDate" dateFormat="MM/dd/yyyy" />
        </div>
        <div >
          <button className="btn btn-success" type="submit" >Search</button>

        </div>
        <div>
          <DownloadTableExcel
            filename="itemSalePurchase"
            sheet="Receivable"
            currentTableRef="itemSalePurchase"
          >
            <button className="btn btn-success">Download as Excel</button>
          </DownloadTableExcel>
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

      {itemSalePurchase ?
        <div>
          <div>
            <div><h2>Summary</h2></div>
            <table border='1'>
              <thead>
                <tr>
                  <th>Records</th>
                  <th>Stock Qty</th>
                  <th>Purchase Qty</th>
                  <th>Purchase Value</th>
                  <th>Sale Qty</th>
                  <th>Sale Value</th>
                  <th>Sale Profit</th>
                </tr>
              </thead>
              <tbody>
                {<tr>
                  <td>{totalRows}</td>
                  <td>{parseFloat(totalQty).toFixed(3)}</td>
                  <td>{parseFloat(totalPurchaseQty).toFixed(3)}</td>
                  <td>{parseFloat(totalPurchaseValue).toFixed(3)}</td>
                  <td>{parseFloat(totalSaleQty).toFixed(3)}</td>
                  <td>{parseFloat(totalSaleValue).toFixed(3)}</td>
                  <td>{parseFloat(totalSaleProfit).toFixed(3)}</td>

                </tr>
                }
              </tbody>
            </table>
          </div>
          <div>
            <h3>Item Sale Purchase View</h3>
            <table border='1' id="itemSalePurchase">

              <thead>
                <tr>
                  <th onClick={() => requestSort('id', 'Text')}>Item Id</th>
                  <th onClick={() => requestSort('name', 'Text')}>Name</th>
                  <th onClick={() => requestSort('code', 'Text')}>Code</th>
                  <th onClick={() => requestSort('desctiption', 'Text')}>Description</th>
                  <th onClick={() => requestSort('quantity', 'Float')}>Stock Qty</th>
                  <th onClick={() => requestSort('pquantity', 'Float')}>Purchase Qty</th>
                  <th onClick={() => requestSort('pvalue', 'Float')}>Purchase Value</th>
                  <th onClick={() => requestSort('squantity', 'Float')}>Sale Qty</th>
                  <th onClick={() => requestSort('svalue', 'Float')}>Sale Value</th>
                  <th onClick={() => requestSort('sprofit', 'Float')}>Sale Profit</th>
                </tr>
              </thead>
              <tbody>
                {
                  itemSalePurchase.map((item, index) => (
                    //   console.log(item);
                    <tr key={index} >
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.code}</td>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{item.pquantity}</td>
                      <td>{parseFloat(item.pvalue).toFixed(3)}</td>
                      <td>{parseFloat(item.squantity).toFixed(3)}</td>
                      <td>{item.svalue}</td>
                      <td>{parseFloat(item.sprofit).toFixed(3)}</td>

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
    </div>
  )
}

const mapStateToProps = state => ({
  currentUser: state.user.user.user
})


export default connect(mapStateToProps)(ItemSalePurchaseDateWise);

