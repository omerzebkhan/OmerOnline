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
    <Text style={styles.qty}>Stock Value</Text>
    <Text style={styles.rate}>Qty</Text>
  </View>
);

const InvoiceTableRow = ({items,sDate,eDate}) => {
  const rows = items.map((item, index) => {
    if (index === 26)
    {
      return <View key={index+1000}>
      <View > 
      <InvoiceNo sDate={sDate} eDate={eDate} /> 
      <InvoiceTableHeader />
      </View>
      <View style={styles.row} key={index}>
      <Text style={styles.R_description}>{item.name}</Text>
      <Text style={styles.R_qty}>{item.quantity}</Text>
      <Text style={styles.R_rate}>{item.sum}</Text>
      </View>
    </View>;
    }
    else
    {
      return <View style={styles.row} key={index}>
      <Text style={styles.R_description}>{item.name}</Text>
      <Text style={styles.R_qty}>{item.quantity}</Text>
      <Text style={styles.R_rate}>{item.sum}</Text>
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



const InvoiceNo = ({sDate, eDate }) => (
  <Fragment>
    <View style={styles.invoiceNoContainer}>
      <Text style={styles.label}>Start Date:{sDate}</Text>
      <Text style={styles.invoiceDate}>End Date:{eDate}</Text>

    </View >  
    
  </Fragment>
);
const InvoiceThankYouMsg = () => (
  <View style={styles.t_titleContainer}>
    <Text style={styles.t_reportTitle}>Thank you for your business</Text>
  </View>
);

const InvoiceTableFooter = ({ items }) => {
  var totalQty = 0.00;
  var totalStockValue = 0.00;
  items.map((item, index) => {
    //console.log(index)
    totalQty = parseFloat(totalQty) + parseFloat(item.sum);
    totalStockValue = parseFloat(totalStockValue) + parseFloat(item.quantity);
    return "";
  })
  return (
    <View style={styles.tf_row}>
      <Text style={styles.tf_description}>TOTAL</Text>
      <Text style={styles.tf_qty}>{parseFloat(totalStockValue)}</Text>
      <Text style={styles.tf_rate}>{parseFloat(totalQty)}</Text>

    </View>
  )
};

const MyDoc = ({ data, sDate, eDate}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        {/* <Image style={styles.logo} src={logo} /> */}
        <InvoiceTitle title='Summary Invoice' />
        <InvoiceTitle title='N & M Traders' />
        <InvoiceNo sDate={sDate} eDate={eDate} />
        <InvoiceTableHeader />
        {/* to print on next page */}
        <InvoiceTableRow items={data}  sDate={sDate} eDate={eDate} />  
        {/* check if the length of data is more than the paga then add header again */}
        {<InvoiceTableFooter items={data} /> }
        <InvoiceThankYouMsg />
      </View>

    </Page>
  </Document>
);


const PrintSaleSummary = ({data,sDate,eDate}) => {
  console.log(`Print invoice is called called..
    data = ${data}
    start date = ${sDate}
    end date = ${eDate}`);
 
  return (
    <div className="App">

      <PDFDownloadLink document={<MyDoc
        data={data}
        sDate={sDate}
       eDate={eDate}

      />} 
      fileName={"SummaryInvoice.pdf"} >
        {/* fileName="somename.pdf">   */}
        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Summary Invoice Print')}
      </PDFDownloadLink>
    </div>
 );
}





export default PrintSaleSummary;