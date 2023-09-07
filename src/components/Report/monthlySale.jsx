import React, { useState, useEffect,useLayoutEffect } from 'react';
import { connect } from 'react-redux';
//import { Bar, Line, Pie } from 'react-chartjs-2';


import itemService from "../../services/item.services";
import DatePicker from "react-datepicker";
import inventoryService from '../../services/inventory.service';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';


//import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart,Bar, Line, Pie } from 'react-chartjs-2';
ChartJS.register(...registerables);



const MonthlySale = ({currentUser}) => {

    

    const [saleMonthly, setSaleMonthly] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [sortConfig, setSortConfig] = useState();
    const [itemInput, setItemInput] = useState("");
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);

    const [access, setAccess] = useState(false);
    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("MonthlySale", currentUser.rights));
        //console.log(`access value = ${access}`)
    }
        , []);
    // set data
const [barData, setBarData] = useState({
        labels: ['label 1', 'label 2', 'label 3', 'label 4'],
        datasets: [
            {
                label: 'test label',
                data: [48,35,73,82],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderWidth: 3
            }
        ]
    });
// set options
const [barOptions, setBarOptions] = useState({
    options: {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        },
        title: {
            display: true,
            text: 'Data Orgranized In Bars',
            fontSize: 25
        },
        legend: {
            display: true,
            position: 'top'
        }
    }
});



    const handleStartDTPicker = (date) => { setStartDate(date); }

    const handleEndDTPicker = (date) => { setEndDate(date); }
    const handleSubmit = event => {
        event.preventDefault();
        getMonthlySale();

    }

    const  requestSort = async (key,type) => {
   
        console.log('sorting function')
        console.log(type)
        if (sortConfig === 'ascending' ) {
          setSortConfig('descending');
        }
        else
        {
            setSortConfig('ascending');
        }
        //sort base on the key and sortcofig

        var arr = saleMonthly;

        function sortByKey(a, b) {

            if ((type ==='Float' ? parseFloat(a[key]) : a[key])  < (type ==='Float' ? parseFloat(b[key]): [key])) {
                return sortConfig === 'ascending' ? -1 : 1;
              }
              if ((type ==='Float' ? parseFloat(a[key]): a[key]) > (type ==='Float' ? parseFloat(b[key]): b[key])) {
                return sortConfig === 'ascending' ? 1 : -1;
              }
              return 0;
            }
            
  
          const sorted = arr.sort(sortByKey);
          //        console.log(sorted);
        console.log(sorted)
          setFilteredOptionsItem(sorted);


      };
    
     


    const getMonthlySale = () => {

        inventoryService.getMonthlySale(startDate.toDateString(), endDate.toDateString())
            .then(response2 => {
                setSaleMonthly(response2.data)
                setFilteredOptionsItem(response2.data)
                console.log(response2.data)
                // Graph data
                console.log(response2.data) 
                const header = Object.keys(response2.data).map((index,key) => response2.data[index].month);
                const result = Object.keys(response2.data).map((index,key) => response2.data[index].totalsale);
                const result1 = Object.keys(response2.data).map((index,key) => response2.data[index].profit);
                console.log(result)
                setBarData({
                    labels: header,
                    datasets: [
                        {
                            label: 'Total Sale',
                            data: result,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)'
                            ],
                            borderWidth: 3
                        },
                        {
                            label: 'Total profit',
                            data: result1,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)'
                            ],
                            borderWidth: 3
                        }
                    ]
                })
                /////////////////////////////////////////////////
            })
            .catch(e => {
                console.log(`get monthly sale Report error ${e}`);
            })
    }

    return (
        <div className="submit-form container">

            <h1>Monthly Sale Report</h1>
            <form onSubmit={handleSubmit}>
                <div>

                    Start Date
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker id="datePicker" selected={startDate} onChange={handleStartDTPicker}
                        name="startDate" dateFormat="MM/dd/yyyy" />
                </div>
                <div>
                    End Date
                    {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
                    <DatePicker id="datePicker" selected={endDate} onChange={handleEndDTPicker}
                        name="startDate" dateFormat="MM/dd/yyyy" />
                </div>
                <div >
                    <button className="btn btn-success" type="submit" >Search</button>
                </div>
              
            </form>
            {filteredOptionsItem.length >0 ?
                <div>

                    <table border='1' id="itemLimitView">

                        <thead>
                            <tr>
                                <th onClick={() => requestSort('month','Float')}>Month</th>
                                <th onClick={() => requestSort('totalSale','Float')}>Total Sale</th>
                                <th onClick={() => requestSort('totalItem','Float')}>Total Items</th>
                                <th onClick={() => requestSort('profit','Float')}>Total Profit</th>
                                
                            </tr>
                        </thead>

                        <tbody>


                            {
                                filteredOptionsItem.map((item, index) => (
                                    //   console.log(item);

                                    <tr key={index}
                                    //onClick={() => setActiveBrand(item, index)}
                                    >
                                        <td>{item.month}</td>
                                        <td>{item.totalsale}</td>
                                        <td>{item.totalitem}</td>
                                        <td>{item.profit}</td>
                                    </tr>
                                )
                                )

                            }
                        </tbody>
                    </table>
                    <div className="BarExample">
                        <Bar
                            data={barData}
                            options={barOptions} />
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


export default connect(mapStateToProps)(MonthlySale);


