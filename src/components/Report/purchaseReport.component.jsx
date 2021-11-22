import React from 'react';
import { connect } from 'react-redux';

import { fetchPurchaseByDate } from '../../redux/purchase/purchase.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

class PurchaseReport extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
          startDate: new Date(),
          endDate: new Date()
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
        console.log(
            `start date = ${this.state.startDate.toDateString()}
            end date = ${this.state.endDate.toDateString()}
        `);
        const { fetchPurchaseByDate } = this.props;
        fetchPurchaseByDate(this.state.startDate.toDateString(),this.state.endDate.toDateString());
    }

   

    render() {
        return (
            <div className="submit-form">

                <h1>Purchase Report</h1>
                <form onSubmit={this.handleSubmit}>
                  
                    <div>
                    Start Date    
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker
                      id = "datePicker" 
                      selected={ this.state.startDate }
                      onChange={ this.handleStartDTPicker }
                      name="startDate"
                      dateFormat="MM/dd/yyyy"
                    />
                    </div>
                    <div>
                    End Date    
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker
                      id = "datePicker" 
                      selected={ this.state.endDate }
                      onChange={ this.handleEndDTPicker }
                      name="startDate"
                      dateFormat="MM/dd/yyyy"
                    />
                    </div>
                    <div >
                        <button className="btn btn-success" type="submit" >Search</button>

                    </div>
                </form>

                { this.props.purchaseData ?
                    <div>
                        <h3>purchase View</h3>
                        <table border='1'>

                            <thead>
                                <tr>
                                    <th>Reff Invoice</th>
                                    <th>Total Items</th>
                                    <th>Invoice Value</th>
                                    <th>Date Time</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.props.purchaseData.map((item, index) => (
                                        //   console.log(item);
                                        <tr key={index}
                                           //onClick={() => setActiveBrand(item, index)}
                                        >
                                            <td>{item.reffInvoice}</td>
                                            <td>{item.totalitems}</td>
                                            <td>{item.invoicevalue}</td>
                                            <td>{item.dt}</td>
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
        )}
}

const mapStateToProps = state => ({
                    purchaseData: state.purchase.purchase
})

const mapDispatchToProps = dispatch =>({
  fetchPurchaseByDate: (sDate,eDate) => dispatch(fetchPurchaseByDate(sDate,eDate))  
});

export default connect(mapStateToProps,mapDispatchToProps)(PurchaseReport);
