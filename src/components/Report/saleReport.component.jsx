import React from 'react';
import { connect } from 'react-redux';

import { fetchSaleByDate,fetchSaleInvoiceDetailAsync } from '../../redux/Sale/sale.action';
import { fetchUserByInputAsync } from '../../redux/user/user.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import PdfInvoice from "./printInvoice"

class SaleReport extends React.Component {

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
        const { fetchSaleByDate } = this.props;
        fetchSaleByDate(this.state.startDate.toDateString(),this.state.endDate.toDateString());
    }

    selectInvoice = (item) => {
        console.log("Select Invoice clicked");
        console.log(item.id);
        console.log(`customer id = ${item.customerId}`)
        // const { fetchUserByInputAsync } = this.props;
        this.props.fetchUserByInputAsync(item.customerId);
        this.props.fetchSaleInvoiceDetailAsync(item.id);
    }

    render() {
        return (
            <div className="submit-form container">
                <h1>Sale Report</h1>
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

                { this.props.saleData ?
                    <div>
                        <h3>Sale View</h3>
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
                                this.props.saleData.map((item, index) => (
                                        //   console.log(item);
                                        <tr key={index}
                                        onClick={() => this.selectInvoice(item)}
                                        >
                                            <td>{item.id}</td>
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
        {this.props.saleInvoiceDetailData ?
                    <div>
                        <h3>Sale Invoice Detail View</h3>
                        <table id='returnTBL' border='1'>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Date</th>
                                    <th>Sale Id</th>
                                    <th>Item Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.saleInvoiceDetailData.map((item, index) => (
                                        //   console.log(item);
                                        <tr key={index}
                                        // onClick={() => this.selectInvoice(item)}
                                        >
                                            <td>{item.id}</td>
                                            <td>{item.createdAt}</td>
                                            <td>{item.SaleInvoiceId}</td>
                                            <td>{item.items.name}</td>
                                            <td>{item.saleprice}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.costPrice}</td>
                                            
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <PdfInvoice invoice={this.props.saleInvoiceDetailData} customer={this.props.user} />
        </div>
          
          :
          ""
      }
      </div>  
)}}

const mapStateToProps = state => ({
                    user: state.user.users,
                    saleData: state.sale.sale,
                    saleInvoiceDetailData: state.sale.saleInvoiceDetail
})

const mapDispatchToProps = dispatch =>({
  fetchSaleByDate: (sDate,eDate) => dispatch(fetchSaleByDate(sDate,eDate)),
  fetchSaleInvoiceDetailAsync: (invoiceId) => dispatch(fetchSaleInvoiceDetailAsync(invoiceId)),  
  fetchUserByInputAsync: (id) => dispatch(fetchUserByInputAsync(id)),
});

export default connect(mapStateToProps,mapDispatchToProps)(SaleReport);
