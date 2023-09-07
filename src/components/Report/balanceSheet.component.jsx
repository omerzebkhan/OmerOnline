import React,{ useState, useEffect,useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import inventoryService from '../../services/inventory.service';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

//class BalanceSheet extends React.Component {
const BalanceSheet =({currentUser}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalRows,setTotalRows] = useState(0);
    const [totalSale,setTotalSale] = useState(0);
    const [totalProfit,setTotalProfit] = useState(0);
    const [totalPurchase,setTotalPurchase] = useState(0);
    const [totalExpense,setTotalExpense] = useState(0);
    const [totalCashRec,setTotalCashRec] = useState(0);
    const [totalBankRec,setTotalBankRec] = useState(0);
    const [totalCashPaid,setTotalCashPaid] = useState(0);
    const [totalBankPaid,setTotalBankPaid] = useState(0);
    const [BalanceSheet,setBalanceSheet] = useState(0);

    const [access, setAccess] = useState(false);
    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("BALANCESHEET", currentUser.rights));
        //console.log(`access value = ${access}`)
    }
        , []);
    
    useEffect(() => {
      var sumRecord = 1
      var sumTotalSale = 0
      var sumTotalProfit = 0
      var sumTotalPurchase = 0
      var sumTotalExpense = 0
      var sumTotalCashRev = 0
      var sumTotalBankRev = 0
      var sumTotalCashPaid = 0
      var sumTotalBankPaid = 0
      if(BalanceSheet){
      BalanceSheet.map((item, index) =>{
          sumRecord = index + 1
          setTotalRows(sumRecord)
          sumTotalSale = sumTotalSale + item.totalSale
          setTotalSale(sumTotalSale)
          sumTotalProfit = sumTotalProfit + item.totalProfit
          setTotalProfit(sumTotalProfit)
          sumTotalPurchase = sumTotalPurchase + item.totalPurchase
          setTotalPurchase(sumTotalPurchase)
          sumTotalExpense = sumTotalExpense + item.totalExpense
          setTotalExpense(sumTotalExpense)
          sumTotalCashRev = sumTotalCashRev + item.totalCashReceived
          setTotalCashRec(sumTotalCashRev)
          sumTotalBankRev = sumTotalBankRev + item.totalBankReceived
          setTotalBankRec(sumTotalBankRev)
          sumTotalCashPaid = sumTotalCashPaid + item.totalCashPaid
          setTotalCashPaid(sumTotalCashPaid)
          sumTotalBankPaid = sumTotalBankPaid + item.totalBankPaid
          setTotalBankPaid(sumTotalBankPaid)
      })}
  }, [BalanceSheet])

    const handleStartDTPicker = (date) => { setStartDate(date); }

    const handleEndDTPicker = (date) => { setEndDate(date);  }

  const handleSubmit = event => {
    event.preventDefault();
    // console.log("submit handler of searchBrand ");
    // console.log(
    //     `start date = ${this.state.startDate.toDateString()}
    //     end date = ${this.state.endDate.toDateString()}
    // `);
    //const { fetchSaleByDate } = this.props;
    // call balance sheet web service.

    inventoryService.getBalanceSheetByDate(startDate.toDateString(), endDate.toDateString())
      .then(response => {

        // var isDescending = true; //set to false for ascending
        // console.log(["8/2/2020", "8/1/2020", "8/13/2020", "8/2/2020"].sort((a, b) => isDescending ? new Date(b).getTime() - new Date(a).getTime() : new Date(a).getTime() - new Date(b).getTime()));
        //console.log(response.data.sort((a, b) => isDescending ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime()));
        //var arr1 = [{ id: 1, date: '30/10/2021' }, { id: 1, date: '25/10/2021' }, { id: 1, date: '29/09/2021' }]
        //const sorted1 = arr1.sort(sortByDate);
        //console.log(sorted1);
        var arr = response.data;
        //console.log(arr) 

        function sortByDate(a, b) {
          //console.log(`${a.date}  ${b.date}`)


          a = a.date.split('/').reverse().join('');
          b = b.date.split('/').reverse().join('');
          return a > b ? 1 : a < b ? -1 : 0;

        }

        const sorted = arr.sort(sortByDate);
        //        console.log(sorted);
      setBalanceSheet(sorted);


      })
      .catch(error => {
        //const obj = JSON.parse(error.response.request.response);
        //console.log(obj.errorMessage)
        console.log(error.response.request.response.errorMessage);

      });

  }



 
    return (
      <div className="submit-form container">

        <h1>Balance Sheet Report</h1>
        <form onSubmit={handleSubmit}>

          <div>
            Start Date
            <DatePicker id="datePicker" selected={startDate} onChange={handleStartDTPicker}
            name="startDate" dateFormat="MM/dd/yyyy" />
          </div>
          <div>
            End Date
            <DatePicker id="datePicker" selected={endDate} onChange={handleEndDTPicker}
              name="startDate" dateFormat="MM/dd/yyyy" />
          </div>
          <div >
            <button className="btn btn-success" type="submit" >Search</button>

          </div>
        </form>

        {BalanceSheet ?
          <div>
            <div>
              <div><h2>Summary</h2></div>
              <table border='1'>
                <thead>
                  <tr>
                    <th>Records</th>
                    <th>Sale</th>
                    <th>Profit</th>
                    <th>Purchase</th>
                    <th>Expense</th>
                    <th>Cash Receieved</th>
                    <th>Bank Receieved</th>
                    <th>Cash paid</th>
                    <th>Bank paid</th>
                  </tr>
                </thead>
                <tbody>
                  {   <tr>
                        <td>{totalRows}</td>
                        <td>{parseFloat(totalSale).toFixed(3)}</td>
                        <td>{parseFloat(totalProfit).toFixed(3)}</td>
                        <td>{parseFloat(totalPurchase).toFixed(3)}</td>
                        <td>{parseFloat(totalExpense).toFixed(3)}</td>
                        <td>{parseFloat(totalCashRec).toFixed(3)}</td>
                        <td>{parseFloat(totalBankRec).toFixed(3)}</td>
                        <td>{parseFloat(totalCashPaid).toFixed(3)}</td>
                        <td>{parseFloat(totalBankPaid).toFixed(3)}</td>
                      </tr>
                  }
                </tbody>
              </table>
            </div>
            <div>
              <h3>Balance Sheet View</h3>
              <table border='1'>

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sale</th>
                    <th>Profit</th>
                    <th>Purchase</th>
                    <th>Expense</th>
                    <th>Cash Receieved</th>
                    <th>Bank Receieved</th>
                    <th>Cash paid</th>
                    <th>Bank paid</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    BalanceSheet.map((item, index) => (
                      //   console.log(item);
                      <tr key={index} >
                        <td>{item.date}</td>
                        <td>{parseFloat(item.totalSale).toFixed(3)}</td>
                        <td>{parseFloat(item.totalProfit).toFixed(3)}</td>
                        <td>{parseFloat(item.totalPurchase).toFixed(3)}</td>
                        <td>{parseFloat(item.totalExpense).toFixed(3)}</td>
                        <td>{parseFloat(item.totalCashReceived).toFixed(3)}</td>
                        <td>{parseFloat(item.totalBankReceived).toFixed(3)}</td>
                        <td>{parseFloat(item.totalCashPaid).toFixed(3)}</td>
                        <td>{parseFloat(item.totalBankPaid).toFixed(3)}</td>
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
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(BalanceSheet);

