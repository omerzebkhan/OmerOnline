import React from 'react';
import { connect } from 'react-redux';

import { fetchPurchaseByDate,fetchPurchaseInvoiceDetailAsync } from '../../redux/purchase/purchase.action';
import { fetchUserByInputAsync } from '../../redux/user/user.action';
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
        // console.log(
        //     `start date = ${this.state.startDate.toDateString()}
        //     end date = ${this.state.endDate.toDateString()}
        // `);
        const { fetchPurchaseByDate } = this.props;
        fetchPurchaseByDate(this.state.startDate.toDateString(),this.state.endDate.toDateString());
    }

    selectInvoice = (item) => {
      console.log("Select Invoice clicked");
      console.log(item.id);

      console.log(`customer id = ${item.supplierId}`)
      // const { fetchUserByInputAsync } = this.props;
      this.props.fetchUserByInputAsync(item.supplierId);

      this.props.fetchPurchaseInvoiceDetailAsync(item.id);
  }

    render() {
        return (
            <div className="submit-form container">

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
                                    <th>Purchase Id</th>
                                    <th>Customer Name</th>
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
                                        onClick={() => this.selectInvoice(item)}
                                        >
                                            <td>{item.reffInvoice}</td>
                                            <td>{item.id}</td>
                                            <td>{item.suppliers.name}</td>
                                            <td>{item.totalitems}</td>
                                            <td>{item.invoicevalue}</td>
                                            <td>{item.createdAt}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        </div>
           :
           ""
           }
           {this.props.purchaseInvoiceDetailData ?
                    <div>
                        <h3>Purchase Invoice Detail View</h3>
                        <table id='returnTBL' border='1'>

                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Date</th>
                                    <th>Purchase Id</th>
                                    <th>Item Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                  
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.purchaseInvoiceDetailData.map((item, index) => (
                                        //   console.log(item);
                                        <tr key={index}
                                        // onClick={() => this.selectInvoice(item)}
                                        >
                                            <td>{item.id}</td>
                                            <td>{item.createdAt}</td>
                                            <td>{item.purchaseInvoiceId}</td>
                                            <td>{item.items.name}</td>
                                            <td>{item.price}</td>
                                            <td>{item.quantity}</td>
                                            
                                            
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {/* <PdfInvoice invoice={this.props.saleInvoiceDetailData} customer={this.props.user} /> */}
        </div>
          
          :
          ""
      }
        </div>
        )}
}

const mapStateToProps = state => ({
                    purchaseData: state.purchase.purchase,
                    purchaseInvoiceDetailData: state.purchase.purchaseInvoiceDetail
})

const mapDispatchToProps = dispatch =>({
  fetchPurchaseByDate: (sDate,eDate) => dispatch(fetchPurchaseByDate(sDate,eDate)),
  fetchPurchaseInvoiceDetailAsync: (invoiceId) => dispatch(fetchPurchaseInvoiceDetailAsync(invoiceId)),
  fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),  
});

export default connect(mapStateToProps,mapDispatchToProps)(PurchaseReport);
