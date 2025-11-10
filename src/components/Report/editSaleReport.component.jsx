import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';


import { fetchEditSale} from '../../redux/Sale/sale.action';

import { fetchItemStartAsync } from '../../redux/item/item.action';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

const EditSaleReport = ({
    fetchItemStartAsync, itemData,
    fetchEditSale, editSaleData,
    currentUser
}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [invoiceNo, setInvoiceNo] = useState("");
    const [message, setMessage] = useState("");
    // const [returnSale,setRetrunSale] = useState([])
    //const [content, setContent] = useState("");
    const [access, setAccess] = useState(false);

    const [cItem, setcItem] = useState([]);
    const [itemInput, setItemInput] = useState("");
    const [activeOptionItem, setActiveOptionItem] = useState("");
    const [showOptionsItem, setShowOptionsItem] = useState(false);
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);

    
    const [filteredSale, setFilteredSale] = useState([]);
    const [selectFilteredSale, setSelectFilteredSale] = useState([]);


    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("SALE RETURN", currentUser.rights));
        //bypass access
        setAccess("True")
        console.log(`access value = ${access}`)
    }
        , []);

    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync])

    useEffect(() => {
        setFilteredSale(editSaleData)
        console.log("filtered data")
        console.log(filteredSale)
    }, [editSaleData])


    const handleChange = event => {
        console.log(`event id = ${event.target.id}
        event value = ${event.target.value}`);

        document.getElementById(event.target.id).value = event.target.value;
        if (event.target.id === "invoiceNo") {
            setInvoiceNo(event.target.value);
        }
        else if (event.target.id === "itemSearch") {

            console.log("Event value");
            console.log(event.target.value)
            //console.log()          
            setFilteredOptionsItem(itemData.filter(
                (option) => option.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
            ));
            setActiveOptionItem(0);
            setShowOptionsItem(true);
            //setItemInput(itemInput);
            setItemInput(event.target.value);
        }
        
    }
    const handleStartDTPicker = (date) => {
        setStartDate(date);
    }

    const handleEndDTPicker = (date) => {
        setEndDate(date);
    }


    const handleSubmit = event => {
        event.preventDefault();
        
        var item = "0";
        var inv = "0";

        if (invoiceNo !== "") { inv = invoiceNo; }
        if (cItem.length > 0) { item = cItem[0].id }
        fetchEditSale(startDate.toDateString(), endDate.toDateString(),item, inv);
        console.log(editSaleData)

    }


    


    //////////////////////////////////////////////////////////////////////
    /////////////////////////// Drop down logic for Item 
    const onKeyDownItem = (e) => {
        // console.log("On change is fired")
        // console.log(e.keyCode)
        // console.log(itemInput)
        // const { activeOption, filteredOptions } = this.props;
        if (e.keyCode === 13 && itemInput !== "")   //Enter key
        {
            setActiveOptionItem(0);
            setShowOptionsItem(false);
            setItemInput(filteredOptionsItem[activeOptionItem]);
        } else if (e.keyCode === 38) {
            if (activeOptionItem === 0) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionItem(activeOptionItem - 1)
        } else if (e.keyCode === 40) {
            if (activeOptionItem - 1 === filteredOptionsItem.length) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionItem(activeOptionItem + 1)
        }
    };
    const onClickItem = (e) => {
        setActiveOptionItem(0);
        setFilteredOptionsItem([]);
        setShowOptionsItem(false);

        // console.log(e.currentTarget.dataset.id);
        // console.log(itemData);
        const selectedItem = itemData.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        setItemInput(selectedItem[0].name);
        setcItem(selectedItem);
        // setPrice(selectedItem[0].showroomprice)


    };
    let optionListItem;
    if (showOptionsItem && itemInput) {
        // console.log(filteredOptionsItem);
        // console.log(filteredOptionsItem.length)
        if (filteredOptionsItem.length) {
            optionListItem = (
                <ul className="options">
                    {filteredOptionsItem.map((optionName, index) => {
                        let className;
                        if (index === activeOptionItem) {
                            className = 'option-active';
                        }
                        return (
                            <li key={optionName.id} className={className} data-id={optionName.id} onClick={onClickItem}>
                                <table border='1' id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>

                                            <th style={{ width: "80%" }}>Name</th>
                                            <th>ShowRoom</th>
                                            <th>Cost</th>
                                            <th>ShowRoom Price</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{optionName.name}</td>
                                            <td>{optionName.showroom}</td>
                                            <td>{optionName.averageprice}</td>
                                            <td>{optionName.showroomprice}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            optionListItem = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }
    //////////////////////////////////////////////////////////////////////  



    

   


    return (
        <div className="container">
            {access ?
                <div>
                    <div >
                        <div className="searchFormHeader"><h1>Sale Edit Report</h1></div>
                        {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

                        <div className="searchForm">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group row">
                                    <div className="col-sm-3">
                                        Start Date
                                        <DatePicker id="datePicker" selected={startDate} onChange={handleStartDTPicker}
                                            name="startDate" dateFormat="MM/dd/yyyy" />
                                    </div>
                                    <div className="col-sm-3">
                                        End Date
                                        <DatePicker id="datePicker" selected={endDate} onChange={handleEndDTPicker}
                                            name="startDate" dateFormat="MM/dd/yyyy" />
                                    </div>
                                </div>                              
                               
                                <div className="form-group row">
                                    <div className="col-sm-2">
                                        <label className="col-sm-2 col-form-label" htmlFor="Item" >Item </label>
                                    </div>
                                    <div className="col-sm-2">
                                        <input
                                            type="text"
                                            name="itemSearch"
                                            id="itemSearch"
                                            placeholder="Select Item"
                                            value={itemInput}
                                            onChange={handleChange}
                                            onKeyDown={onKeyDownItem}
                                        />
                                    </div>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            name="Item"
                                            id="Item"
                                            placeholder="ShowRoom Quantity"
                                            value={cItem[0] ? cItem[0].showroom : ""}
                                            disabled />
                                    </div>
                                    <div>
                                        {optionListItem}
                                    </div>
                                </div>


                                <div className="form-group row">
                                    <div className="col-sm-2">
                                        <label className="col-form-label" htmlFor="Item">Inovce No.</label>
                                    </div>
                                    <div className="col-sm-2">
                                        <input
                                            type="text"
                                            name="invoiceNo"
                                            id="invoiceNo"
                                            placeholder="InvoiceNo"
                                            value={invoiceNo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div >
                                    <button className="btn btn-success" type="submit" >Search</button>

                                </div>

                            </form>

                        </div>
                        {filteredSale ?
                            //filteredSale.length > 0 ?
                                <div>
                                    <h3>Sale View</h3>
                                    <table border='1'>

                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Sale Id</th>
                                                <th>Sale Detail Id</th>
                                                <th>Item Name</th>
                                                <th>Old Price</th>
                                                <th>Old Qty</th>
                                                <th>New Price</th>
                                                <th>New Qty</th>
                                                <th>Final Qty</th>
                                                <th>Before Edit Qty</th>
                                                <th>Comments</th>
                                                <th>Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredSale.map((item, index) => (
                                                    console.log(item),
                                                    <tr key={index}
                                                       // onClick={() => selectInvoice(item)}
                                                    >
                                                        <td>{item.id}</td>
                                                        <td>{item.saleinvoiceid}</td>
                                                        <td>{item.saledetailid}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.oldprice}</td>
                                                        <td>{item.oldqty}</td>
                                                        <td>{item.newprice}</td>
                                                        <td>{item.newqty}</td>
                                                        <td>{item.finalqty}</td>
                                                        <td>{item.beforeqty}</td>
                                                        <td>{item.comments}</td>
                                                        <td>{item.createdAt}</td>
                                                        
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                // :
                                // "No Data Found"
                            :
                            "No data found"
                        }
                       
                    </div>
                </div>
                :
                "Access denied for the screen"}
        </div>
    )
}



const mapStateToProps = state => ({
    user: state.user.users,
    currentUser: state.user.user.user,
    editSaleData: state.sale.editSale,
    saleInvoiceDetailData: state.sale.saleInvoiceDetail,
    userData: state.user.users,
    itemData: state.item.items
})


const mapDispatchToProps = dispatch => ({
    fetchEditSale: (sDate, eDate,itemId, invoiceId) => dispatch(fetchEditSale(sDate, eDate,itemId, invoiceId)),

    fetchItemStartAsync: () => dispatch(fetchItemStartAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSaleReport);