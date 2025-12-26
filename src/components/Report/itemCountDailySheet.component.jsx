import React,{ useState, useEffect,useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import inventoryService from '../../services/inventory.service';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

//class BalanceSheet extends React.Component {
const ItemCountDailySheet =({currentUser}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [ItemCountDailySheet,setItemCountDailySheet] = useState(0);

    const [access, setAccess] = useState(false);
    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("BALANCESHEET", currentUser.rights));
        //bypass authentication
        setAccess("True");
        //console.log(`access value = ${access}`)
    }
        , []);
    
    

    const handleStartDTPicker = (date) => { setStartDate(date); }

    const handleEndDTPicker = (date) => { setEndDate(date);  }

  const handleSubmit = event => {
    event.preventDefault();
    
    inventoryService.getItemCountDailyReport(startDate.toDateString(), endDate.toDateString())
      .then(response => {

       var arr = response.data;
        //console.log(arr) 

        function sortByDate(a, b) {
          //console.log(`${a.date}  ${b.date}`)


          a = a.date.split('/').reverse().join('');
          b = b.date.split('/').reverse().join('');
          return a > b ? 1 : a < b ? -1 : 0;

        }

        const sorted = arr.sort(sortByDate);
                console.log(sorted);
        setItemCountDailySheet(sorted);


      })
      .catch(error => {
        //const obj = JSON.parse(error.response.request.response);
        //console.log(obj.errorMessage)
        console.log(error.response.request.response.errorMessage);

      });

  }



 
    return (
      <div className="submit-form container">

        <h1>Daily Item Count Report</h1>
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

        {ItemCountDailySheet ?
          <div>
            
            <div>
              <h3>Daily Item Count Report</h3>
              <table border='1'>

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sale Id</th>
                    <th>Sale Item Count</th>
                    <th>Purchase Id</th>
                    <th>Purchase Item Count</th>
                    <th>Sale Edit Id</th>
                    <th>Sale Edit Count</th>
                    <th>Sale Return Id</th>
                    <th>Sale Return Count</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {
                    ItemCountDailySheet.map((item, index) => (
                      //   console.log(item);
                      <tr key={index} >
                        <td>{item.date}</td>
                        <td>{parseFloat(item.saleid)}</td>
                        <td>{parseFloat(item.saleitem)}</td>
                        <td>{parseFloat(item.purchaseid)}</td>
                        <td>{parseFloat(item.purchaseitem)}</td>
                        <td>{parseFloat(item.editsaleid)}</td>
                        <td>{parseFloat(item.editsaleitem)}</td>
                        <td>{parseFloat(item.salereturnid)}</td>
                        <td>{parseFloat(item.salereturnitem)}</td>
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
    currentUser: state.user.user
})

export default connect(mapStateToProps)(ItemCountDailySheet);

