import React, { Fragment } from 'react';

//import logo from './logo.svg';
//import './App.css';
import { PDFDownloadLink, Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';

import logo from '../../../src/assets/button/search.ico'
const borderColor = '#90e5fc'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  //table Header
  container: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  description: {
    width: '60%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: '15%'
  },
  // table row 
  row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
  },
  R_BillTo: {
    width: '60%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    fontSize: 15,
    fontStyle: 'bold',
  },
  R_description: {
    width: '60%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  R_qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  R_rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  R_amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
  //Table Footer
  tf_row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontSize: 12,
    fontStyle: 'bold',
  },
  tf_qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  tf_rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  tf_description: {
    width: '60%',
    textAlign: 'right',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  tf_total: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
  //Ttitle of the Invoice 
  titleContainer: {
    flexDirection: 'row',
    marginTop: 1,
  },
  reportTitle: {
    color: '#61dafb',
    letterSpacing: 4,
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  // Bill To Info
  headerContainer: {
    marginTop: 2
  },
  billTo: {
    marginTop: 2,
    paddingBottom: 3,
    fontFamily: 'Helvetica-Oblique'
  },
  //Invoice No & Date
  invoiceNoContainer: {
    marginTop: 2,
    flexDirection: 'row',
  },
  invoiceNo: {
    fontSize: 12,
    fontStyle: 'bold',
    justifyContent: 'flex-start'
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: 'bold',
    justifyContent: 'flex-end'
  },
  label: {
    width: 300
  },
  //Thank you msg
  t_titleContainer: {
    flexDirection: 'row',
    marginTop: 12
  },
  t_reportTitle: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  //LOGO
  logo: {
    width: 74,
    height: 66,
    marginLeft: 'auto',
    marginRight: 'auto'
  }

});

const InvoiceTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.description}>Item Description</Text>
    <Text style={styles.qty}>Qty</Text>
    <Text style={styles.rate}>@</Text>
    <Text style={styles.amount}>Amount</Text>
  </View>
);

const InvoiceTableRow = ({items,customer,invoiceNo,date}) => {
  const rows = items.map((item, index) => {
    if (index === 24)
    {
      return <View >
      <View> 
      <InvoiceNo invoiceNo={invoiceNo} date={date} /> 
      <BillTo customer={customer} />
      <InvoiceTableHeader />
      </View>
      <View style={styles.row} key={index}>
      <Text style={styles.R_description}>{item.itemname}</Text>
      <Text style={styles.R_qty}>{item.quantity}</Text>
      <Text style={styles.R_rate}>{item.price}</Text>
      <Text style={styles.R_amount}>{(item.quantity * item.price).toFixed(2)}</Text>
      </View>
    </View>;
    }
    else
    {
      return <View style={styles.row} key={index}>
      <Text style={styles.R_description}>{item.itemname}</Text>
      <Text style={styles.R_qty}>{item.quantity}</Text>
      <Text style={styles.R_rate}>{item.price}</Text>
      <Text style={styles.R_amount}>{(item.quantity * item.price).toFixed(2)}</Text>
    </View>;
    }
    
  })

  return (<Fragment>{rows}</Fragment>)
};

const InvoiceTitle = ({ title }) => (
  <View style={styles.titleContainer}>
    <Text style={styles.reportTitle}>{title}</Text>
  </View>
);

const BillTo = ({ customer }) => {
  // const rows = customer.map((item, index) => {
  //   return <View style={styles.headerContainer} key={index}>
  //       <Text style={styles.billTo}>Bill To:</Text>  
  //       <Text style={styles.R_description}>{item.name}</Text>


  const rows = <View style={styles.headerContainer} key={1}>
    <Text style={styles.billTo}>Bill To:</Text>
    <Text style={styles.R_BillTo}>{customer[0].customername}</Text>
    <Text style={styles.R_BillTo}>{customer[0].customeraddress}</Text>
    <Text style={styles.billTo}>Created By:</Text>
    <Text style={styles.R_BillTo}>{customer[0].agentname}</Text>
  </View>;


  return (<Fragment>{rows}</Fragment>)


};

const InvoiceNo = ({ invoiceNo, date }) => (
  <Fragment>
    <View style={styles.invoiceNoContainer}>
      <Text style={styles.label}>Invoice No:{invoiceNo}</Text>
      <Text style={styles.invoiceDate}>Date:{date}</Text>

    </View >  
    {/* <View style={styles.invoiceDateContainer}>
      <Text >Date: </Text>
      <Text >{date}</Text>
    </View > */}
  </Fragment>
);
const InvoiceThankYouMsg = () => (
  <View style={styles.t_titleContainer}>
    <Text style={styles.t_reportTitle}>Thank you for your business</Text>
  </View>
);

const InvoiceTableFooter = ({ items }) => {
  var total = 0.00;
  var totalQty = 0.00;
  items.map((item, index) => {
    //console.log(index)
    totalQty = parseFloat(totalQty) + parseFloat(item.quantity);
    total = parseFloat(total) + parseFloat(item.quantity * item.price);
    //console.log(total)                    
    //date = item.dt;
    return "";
  })
  return (
    <View style={styles.tf_row}>
      <Text style={styles.tf_description}>TOTAL</Text>
      <Text style={styles.tf_qty}>{parseFloat(totalQty)}</Text>
      <Text style={styles.tf_rate}> </Text>
      <Text style={styles.tf_total}>{Number.parseFloat(total).toFixed(2)}</Text>
    </View>
  )
};

const MyDoc = ({ data, invoiceNo, date }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        {/* <Image style={styles.logo} src={logo} /> */}
        <InvoiceTitle title='Sale Invoice' />
        <InvoiceTitle title='N & M Traders' />
        <InvoiceNo invoiceNo={invoiceNo} date={date} />
        <BillTo customer={data} />
        <InvoiceTableHeader />
        <InvoiceTableRow items={data} customer={data} invoiceNo={invoiceNo} date={date} />
        {/* check if the length of data is more than the paga then add header again */}
        <InvoiceTableFooter items={data} />
        <InvoiceThankYouMsg />
      </View>

    </Page>
  </Document>
);


const PrintInvoice = ({invoice}) => {
  console.log(`Print invoice is called called..
    customer name = 
    ${invoice[0].customername}`);
  var invoiceNo = "";
  // var customerName= "";
  var date = "";
  invoice.map((item, index) => {
    console.log('')

    invoiceNo = item.saleInvoiceId;
    date = item.createdAt;
    return "";
  })


  //customerName = customer.name;                      
  //date = item.dt;
  //                                     console.log(`invoceNo=${invoiceNo}
  // date=${date}
  // customerName = ${customerName}
  // `)
  return (
    <div className="App">

      <PDFDownloadLink document={<MyDoc
        data={invoice}
        invoiceNo={invoiceNo}
        date={date}
       />} fileName={invoiceNo + ".pdf"} >
        {/* fileName="somename.pdf">   */}
        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Sale Invoice Print')}
      </PDFDownloadLink>
    </div>
  );
}





export default PrintInvoice;