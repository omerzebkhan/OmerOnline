import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import inventoryService from '../../services/inventory.service';

class BalanceSheet extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      BalanceSheet: [],
    };
    this.handleStartDTPicker = this.handleStartDTPicker.bind(this);
    this.handleEndDTPicker = this.handleEndDTPicker.bind(this);
  }

  handleStartDTPicker(date) {
    this.setState({
      startDate: date
    })
  }

  handleEndDTPicker(date) {
    this.setState({
      endDate: date
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    // console.log("submit handler of searchBrand ");
    // console.log(
    //     `start date = ${this.state.startDate.toDateString()}
    //     end date = ${this.state.endDate.toDateString()}
    // `);
    //const { fetchSaleByDate } = this.props;
    // call balance sheet web service.

    inventoryService.getBalanceSheetByDate(this.state.startDate.toDateString(), this.state.endDate.toDateString())
      .then(response => {

        var isDescending = true; //set to false for ascending
        console.log(["8/2/2020", "8/1/2020", "8/13/2020", "8/2/2020"].sort((a, b) => isDescending ? new Date(b).getTime() - new Date(a).getTime() : new Date(a).getTime() - new Date(b).getTime()));
        //console.log(response.data.sort((a, b) => isDescending ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime()));
        var arr1 = [{ id: 1, date: '30/10/2021' }, { id: 1, date: '25/10/2021' }, { id: 1, date: '29/09/2021' }]
        const sorted1 = arr1.sort(sortByDate);
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


        this.setState({
          BalanceSheet: sorted
        })
      

      })
      .catch(error => {
        //const obj = JSON.parse(error.response.request.response);
        //console.log(obj.errorMessage)
        console.log(error.response.request.response.errorMessage);

      });




  }



  render() {
    return (
      <div className="submit-form">

        <h1>Balance Sheet Report</h1>
        <form onSubmit={this.handleSubmit}>

          <div>
            Start Date
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
            <DatePicker
              id="datePicker"
              selected={this.state.startDate}
              onChange={this.handleStartDTPicker}
              name="startDate"
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <div>
            End Date
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
            <DatePicker
              id="datePicker"
              selected={this.state.endDate}
              onChange={this.handleEndDTPicker}
              name="startDate"
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <div >
            <button className="btn btn-success" type="submit" >Search</button>

          </div>
        </form>

        { this.state.BalanceSheet ?
          <div>
            <h3>Balance Sheet View</h3>
            <table border='1'>

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sale</th>
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
                  this.state.BalanceSheet.map((item, index) => (
                    //   console.log(item);
                    <tr key={index} >
                      <td>{item.date}</td>
                      <td>{item.totalSale}</td>
                      <td>{item.totalPurchase}</td>
                      <td>{item.totalExpense}</td>
                      <td>{item.totalCashReceived}</td>
                      <td>{item.totalBankReceived}</td>
                      <td>{item.totalCashPaid}</td>
                      <td>{item.totalBankPaid}</td>
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
}





export default BalanceSheet;
