import React, { useState, useLayoutEffect, useEffect } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'
import userService from "../../services/user.service";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';
import { fetchRoleStartAsync } from '../../redux/role/roles.actions';



const UpdateAccess = ({ currentUser,
    fetchRoleStartAsync, roleData }) => {
    const [role, setRole] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [addBrand, setAddBrand] = useState();
    const [selectAddBrand, setSelectAddBrand] = useState();
    const [searchBrand, setSearchBrand] = useState();
    const [selectSearchBrand, setSelectSearchBrand] = useState();
    const [addCat, setAddCat] = useState();
    const [selectAddCat, setSelectAddCat] = useState();
    const [searchCat, setSearchCat] = useState();
    const [selectSearchCat, setSelectSearchCat] = useState();
    const [addSubCat, setAddSubCat] = useState();
    const [selectAddSubCat, setSelectAddSubCat] = useState();
    const [searchSubCat, setSearchSubCat] = useState();
    const [selectSearchSubCat, setSelectSearchSubCat] = useState();
    const [addItem, setAddItem] = useState();
    const [selectAddItem, setSelectAddItem] = useState();
    const [searchItem, setSearchItem] = useState();
    const [selectSearchItem, setSelectSearchItem] = useState();
    const [purInv, setPurInv] = useState("");
    const [selectPurInv, setSelectPurInv] = useState();
    const [editPurInv, setEditPurInv] = useState("");
    const [selectEditPurInv, setSelectEditPurInv] = useState();
    const [movStk, setMovStk] = useState();
    const [selectMovStk, setSelectMovStk] = useState();
    const [saleInvoice, setSaleInvoice] = useState();
    const [selectSaleInvoice, setSelectSaleInvoice] = useState();
    const [saleReturn, setSaleReturn] = useState();
    const [selectSaleReturn, setSelectSaleReturn] = useState();
    const [editSaleInv, setEditSaleInv] = useState("");
    const [selectEditSaleInv, setSelectEditSaleInv] = useState();
    const [pricing, setPricing] = useState();
    const [selectPricing, setSelectPricing] = useState();
    const [aR, setAR] = useState();
    const [selectAR, setSelectAR] = useState();
    const [aP, setAP] = useState();
    const [selectAP, setSelectAP] = useState();
    const [addExpense, setAddExpense] = useState();
    const [selectAddExpense, setSelectAddExpense] = useState();
    const [addUser, setAddUser] = useState();
    const [selectAddUser, setSelectAddUser] = useState();
    const [searchUser, setSearchUser] = useState();
    const [selectSearchUser, setSelectSearchUser] = useState();
    const [addRole, setAddRole] = useState();
    const [selectAddRole, setSelectAddRole] = useState();
    const [updateAccess, setUpdateAccess] = useState();
    const [selectUpdateAccess, setSelectUpdateAccess] = useState();
    const [addCashFlow, setAddCashFlow] = useState();
    const [selectAddCashFlow, setSelectAddCashFlow] = useState();
    const [cashAR, setCashAR] = useState();
    const [selectCashAR, setSelectCashAR] = useState();
    const [cashAP, setCashAP] = useState();
    const [selectCashAP, setSelectCashAP] = useState();
    const [stkRep, setStkRep] = useState();
    const [selectStkRep, setSelectStkRep] = useState();
    const [purRep, setPurRep] = useState();
    const [selectPurRep, setSelectPurRep] = useState();
    const [saleRep, setSaleRep] = useState();
    const [selectSaleRep, setSelectSaleRep] = useState();
    const [saleRRep, setSaleRRep] = useState();
    const [selectSaleRRep, setSelectSaleRRep] = useState();
    const [balSheet, setBalSheet] = useState();
    const [selectBalSheet, setSelectBalSheet] = useState();
    const [iLmtRep, setILmtRep] = useState();
    const [selectILmtRep, setSelectILmtRep] = useState();
    const [iTrendRep, setITrendRep] = useState();
    const [selectITrendRep, setSelectITrendRep] = useState();
    const [MonthlySale, setMonthlySale] = useState();
    const [selectMonthlySale, setSelectMonthlySale] = useState();
    const [iSPD, setISPD] = useState();
    const [selectISPD, setSelectISPD] = useState();
    const [saleAT, setSaleAT] = useState();
    const [selectSaleAT, setSelectSaleAT] = useState();

    const [cRole, setcRole] = useState([]);
    const [roleInput, setRoleInput] = useState("");
    const [activeOptionRole, setActiveOptionRole] = useState("");
    const [showOptionsRole, setShowOptionsRole] = useState(false);
    const [filteredOptionsRole, setFilteredOptionsRole] = useState([]);

    const [access, setAccess] = useState(false);

    //const currentUser = useSelector((state) => state.user.user.user);

    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("UPDATE ACCESS", currentUser.rights));
        //console.log(`access value = ${access}`)
    }
        , []);

    useEffect(() => {
        fetchRoleStartAsync();

    }, [fetchRoleStartAsync])

    useEffect(() => {
        const Status = [
            { value: "0", text: "Select" },
            { value: "1", text: "true" },
            { value: "2", text: "false" }
        ]
        setSelectAddBrand(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSearchBrand(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectAddCat(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSearchCat(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectAddSubCat(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSearchSubCat(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectAddItem(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSearchItem(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectPurInv(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectEditPurInv(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectMovStk(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSaleInvoice(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSaleReturn(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectEditSaleInv(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectPricing(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectAR(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectAP(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectAddExpense(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectAddUser(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSearchUser(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectAddRole(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectUpdateAccess(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectAddCashFlow(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectCashAR(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectCashAP(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectStkRep(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectPurRep(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSaleRep(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSaleRRep(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectBalSheet(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectILmtRep(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectITrendRep(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectMonthlySale(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectISPD(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
        setSelectSaleAT(Status.map((option) => { return <option value={option.value}>{option.text}</option> }))
    }, [])

    //////////////////////////////////////////////////////////////////////
    /////////////////////////// Drop down logic for Role 
    const onKeyDownRole = (e) => {
        //console.log("On change is fired")
        // const { activeOption, filteredOptions } = this.props;
        //  console.log(`key down ${e.keyCode}`)
        if (e.keyCode === 13) {
            setActiveOptionRole(0);
            setShowOptionsRole(false);
            setRoleInput(filteredOptionsRole[activeOptionRole]);
        } else if (e.keyCode === 38) {
            if (activeOptionRole === 0) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionRole(activeOptionRole - 1)
        } else if (e.keyCode === 40) {
            if (activeOptionRole - 1 === filteredOptionsRole.length) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionRole(activeOptionRole + 1)
        }

    };
    const onClickRole = (e) => {
        setActiveOptionRole(0);
        setFilteredOptionsRole([]);
        setShowOptionsRole(false);
        const selectedRole = roleData.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        setRoleInput(selectedRole[0].name);
        setcRole(selectedRole);

        //////////////////////////////load access rights 
        //// Reset before loading 
        setAddBrand("0")
        setSearchBrand("0")
        setAddCat("0")

        setPurInv("0")
        setMovStk("0")
        setSaleReturn("0")
        setAddExpense("0")
        setPricing("0")
        setSaleInvoice("0")
        setAddRole("0")
        setSearchItem("0")
        setUpdateAccess("0")


        setAddItem("0")

        setSearchSubCat("0")
        setAR("0")
        setAddUser("0")
        setAP("0")
        userService.getRoleAccess(selectedRole[0].id)
            .then(response1 => {
                response1.data.map((item, index) => {
                    if (item.screenName === "Add Brand" && item.status === "true") { setAddBrand("1") }
                    else if (item.screenName === "Search Brand" && item.status === "true") { setSearchBrand("1") }
                    else if (item.screenName === "Add Category" && item.status === "true") { setAddCat("1") }
                    else if (item.screenName === "Search Category" && item.status === "true") { setSearchCat("1") }
                    else if (item.screenName === "Add subCategory" && item.status === "true") { setAddSubCat("1") }
                    else if (item.screenName === "Search subCategory" && item.status === "true") { setSearchSubCat("1") }
                    else if (item.screenName === "Add Item" && item.status === "true") { setAddItem("1") }
                    else if (item.screenName === "Search Item" && item.status === "true") { setSearchItem("1") }
                    else if (item.screenName === "Purchase Invoice" && item.status === "true") { setPurInv("1") }
                    else if (item.screenName === "Update Purchase" && item.status === "true") { setEditPurInv("1") }
                    else if (item.screenName === "Move Stock" && item.status === "true") { setMovStk("1") }
                    else if (item.screenName === "Sale Invoice" && item.status === "true") { setSaleInvoice("1") }
                    else if (item.screenName === "Sale Return" && item.status === "true") { setSaleReturn("1") }
                    else if (item.screenName === "Update Sale" && item.status === "true") { setEditSaleInv("1") }
                    else if (item.screenName === "Pricing" && item.status === "true") { setPricing("1") }
                    else if (item.screenName === "Account Receivable" && item.status === "true") { setAR("1") }
                    else if (item.screenName === "Account Payable" && item.status === "true") { setAP("1") }
                    else if (item.screenName === "Add Expense" && item.status === "true") { setAddExpense("1") }
                    else if (item.screenName === "Add User" && item.status === "true") { setAddUser("1") }
                    else if (item.screenName === "Add Role" && item.status === "true") { setAddRole("1") }
                    else if (item.screenName === "Update Access" && item.status === "true") { setUpdateAccess("1") }
                    else if (item.screenName === "Add CashFlow" && item.status === "true") { setAddCashFlow("1") }
                    else if (item.screenName === "CashFlow AR" && item.status === "true") { setCashAR("1") }
                    else if (item.screenName === "CashFlow AP" && item.status === "true") { setCashAP("1") }
                    else if (item.screenName === "Stock Report" && item.status === "true") {setStkRep("1") }
                    else if (item.screenName === "Purchase Report" && item.status === "true") {setPurRep("1") }
                    else if (item.screenName === "Sale Report" && item.status === "true") {setSaleRep("1") }
                    else if (item.screenName === "SaleReturn Report" && item.status === "true") {setSaleRRep("1") }
                    else if (item.screenName === "BalanceSheet" && item.status === "true") {setBalSheet("1") }
                    else if (item.screenName === "ItemLimit Report" && item.status === "true") {setILmtRep("1") }
                    else if (item.screenName === "ItemTrend Report" && item.status === "true") {setITrendRep("1") }
                    else if (item.screenName === "MonthlySale" && item.status === "true") {setMonthlySale("1") }
                    else if (item.screenName === "ItemSalePurDateWise" && item.status === "true") {setISPD("1") }
                    else if (item.screenName === "SaleAgentTrend" && item.status === "true") {setSaleAT("1") }



                    
                })

            })
            .catch(e => {
                console.log(`catch of getRoleAccess ${e}
                                error from server ${e.message}
                                `);
            })


    };
    let optionListRole;
    if (showOptionsRole && roleInput) {
        if (filteredOptionsRole.length) {
            optionListRole = (
                <ul className="options">
                    {filteredOptionsRole.map((optionName, index) => {
                        let className;
                        if (index === activeOptionRole) {
                            className = 'option-active';
                        }
                        return (
                            <li key={optionName.id} className={className} data-id={optionName.id} onClick={onClickRole}>
                                <table border='1' id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th className="th-sm">Name</th>
                                            <th>Role Namee</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{optionName.name}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            optionListRole = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }
    /////////////////////////////////////////////////////////////////////////

    const handleSubmit = async event => {
        event.preventDefault();
        setLoading(true);
        setMessage("Processing ......");
        saveItem();
    }

    const saveItem = () => {
        var data = [
            { screenname: "Add Brand", status: addBrand },
            { screenname: "Search Brand", status: searchBrand },
            { screenname: "Add Category", status: addCat },
            { screenname: "Search Category", status: searchCat },
            { screenname: "Add subCategory", status: addSubCat },
            { screenname: "Search subCategory", status: searchSubCat },
            { screenname: "Add Item", status: addItem },
            { screenname: "Search Item", status: searchItem },
            { screenname: "Purchase Invoice", status: purInv },
            { screenname: "Update Purchase", status: editPurInv },
            { screenname: "Move Stock", status: movStk },
            { screenname: "Sale Invoice", status: saleInvoice },
            { screenname: "Sale Return", status: saleReturn },
            { screenname: "Update Sale", status: editSaleInv },
            { screenname: "Pricing", status: pricing },
            { screenname: "Account Receivable", status: aR },
            { screenname: "Account Payable", status: aP },
            { screenname: "Add Expense", status: addExpense },
            { screenname: "Add User", status: addUser },
            { screenname: "Search User", status: searchUser },
            { screenname: "Add Role", status: addRole },
            { screenname: "Update Access", status: updateAccess },
            { screenname: "Add CashFlow", status: addCashFlow },
            { screenname: "CashFlow AR", status: cashAR },
            { screenname: "CashFlow AP", status: cashAP },
            { screenname: "Stock Report", status: stkRep },
            { screenname: "Purchase Report", status: purRep },
            { screenname: "Sale Report", status: saleRep },
            { screenname: "SaleReturn Report", status: saleRRep },
            { screenname: "BalanceSheet", status: balSheet },
            { screenname: "ItemLimit Report", status: iLmtRep },
            { screenname: "ItemTrend Report", status: iTrendRep },
            { screenname: "MonthlySale", status: MonthlySale },
            { screenname: "ItemSalePurDateWise", status: iSPD },
            { screenname: "SaleAgentTrend", status: saleAT}
        ];
        console.log(`data to be sent ${data}`);
        userService.updateRoleAccess(cRole[0].id, data)
            .then(response => {
                setMessage(`User successfully Added User id = ${response.data.id}`);
                console.log(response.data);
                setLoading(false);

            })
            .catch(e => {
                console.log(e);
            });
    }


    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "roleSearch") {

            setRoleInput(event.target.value);
            setFilteredOptionsRole(roleData.filter(
                (option) => option.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
            ));
            setActiveOptionRole(0);
            setShowOptionsRole(true);
            setRoleInput(event.target.value);
        }
    }

    return (
        <div>
            {access ?
                <div className="submit-form">
                    <div className="inputFormHeader"><h1>Update Role Access</h1></div>
                    <div className="inputForm">
                        {loading ? <div className="alert alert-warning" role="alert">Processing....</div> : ''}
                        {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}
                        {errorMsg ? <div className="alert alert-warning" role="alert">{errorMsg}</div> : ""}
                        <form onSubmit={handleSubmit}>

                            <div className="form-group row">

                                <label className="col-sm-2 col-form-label" htmlFor="Item">Role Name</label>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="roleSearch"
                                        id="roleSearch"
                                        placeholder="Select Role"
                                        value={roleInput}
                                        onChange={handleChange}
                                        onKeyDown={onKeyDownRole}
                                    />
                                    {optionListRole}
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Add Brand</label>
                                        <div className="col-sm-6">
                                            <select value={addBrand} onChange={(e) => setAddBrand(e.target.value)}>{selectAddBrand}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Search Brand</label>
                                        <div className="col-sm-6">
                                            <select value={searchBrand} onChange={(e) => setSearchBrand(e.target.value)}>{selectPurInv}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Add Category</label>
                                        <div className="col-sm-6">
                                            <select value={addCat} onChange={(e) => setAddCat(e.target.value)}>{selectAddCat}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Search Category</label>
                                        <div className="col-sm-6">
                                            <select value={searchCat} onChange={(e) => setSearchCat(e.target.value)}>{selectSearchCat}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Add Sub Category</label>
                                        <div className="col-sm-6">
                                            <select value={addSubCat} onChange={(e) => setAddSubCat(e.target.value)}>{selectAddSubCat}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Search Sub Category</label>
                                        <div className="col-sm-6">
                                            <select value={searchSubCat} onChange={(e) => setSearchSubCat(e.target.value)}>{selectSearchSubCat}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Add Item</label>
                                        <div className="col-sm-6">
                                            <select value={addItem} onChange={(e) => setAddItem(e.target.value)}>{selectAddItem}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Search Item</label>
                                        <div className="col-sm-6">
                                            <select value={searchItem} onChange={(e) => setSearchItem(e.target.value)}>{selectSearchItem}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Purchase Invoice</label>
                                        <div className="col-sm-6">
                                            <select value={purInv} onChange={(e) => setPurInv(e.target.value)}>{selectPurInv}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Edit Purchase</label>
                                        <div className="col-sm-6">
                                            <select value={editPurInv} onChange={(e) => setEditPurInv(e.target.value)}>{selectEditPurInv}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Move Stock</label>
                                        <div className="col-sm-6">
                                            <select value={movStk} onChange={(e) => setMovStk(e.target.value)}>{selectMovStk}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Sale Invoice</label>
                                        <div className="col-sm-6">
                                            <select value={saleInvoice} onChange={(e) => setSaleInvoice(e.target.value)}>{selectSaleInvoice}</select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Sale Return</label>
                                        <div className="col-sm-6">
                                            <select value={saleReturn} onChange={(e) => setSaleReturn(e.target.value)}>{selectSaleReturn}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Edit Sale</label>
                                        <div className="col-sm-6">
                                            <select value={editSaleInv} onChange={(e) => setEditSaleInv(e.target.value)}>{selectEditSaleInv}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Pricing</label>
                                        <div className="col-sm-6">
                                            <select value={pricing} onChange={(e) => setPricing(e.target.value)}>{selectPricing}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Account Receivable</label>
                                        <div className="col-sm-6">
                                            <select value={aR} onChange={(e) => setAR(e.target.value)}>{selectAR}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Account Payable</label>
                                        <div className="col-sm-6">
                                            <select value={aP} onChange={(e) => setAP(e.target.value)}>{selectAP}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Add Expense</label>
                                        <div className="col-sm-6">
                                            <select value={addExpense} onChange={(e) => setAddExpense(e.target.value)}>{selectAddExpense}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Add User</label>
                                        <div className="col-sm-6">
                                            <select value={addUser} onChange={(e) => setAddUser(e.target.value)}>{selectAddUser}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Search User</label>
                                        <div className="col-sm-6">
                                            <select value={searchUser} onChange={(e) => setSearchUser(e.target.value)}>{selectSearchUser}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Add Role</label>
                                        <div className="col-sm-6">
                                            <select value={addRole} onChange={(e) => setAddRole(e.target.value)}>{selectAddRole}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Update Access</label>
                                        <div className="col-sm-6">
                                            <select value={updateAccess} onChange={(e) => setUpdateAccess(e.target.value)}>{selectUpdateAccess}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Add Cash Flow</label>
                                        <div className="col-sm-6">
                                            <select value={addCashFlow} onChange={(e) => setAddCashFlow(e.target.value)}>{selectAddCashFlow}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Cash Account Receivable</label>
                                        <div className="col-sm-6">
                                            <select value={cashAR} onChange={(e) => setCashAR(e.target.value)}>{selectCashAR}</select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Cash Account Payable</label>
                                        <div className="col-sm-6">
                                            <select value={cashAP} onChange={(e) => setCashAP(e.target.value)}>{selectCashAP}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Stock Report</label>
                                        <div className="col-sm-6">
                                            <select value={stkRep} onChange={(e) => setStkRep(e.target.value)}>{selectStkRep}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Purchase Report</label>
                                        <div className="col-sm-6">
                                            <select value={purRep} onChange={(e) => setPurRep(e.target.value)}>{selectPurRep}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Sale Report</label>
                                        <div className="col-sm-6">
                                            <select value={saleRep} onChange={(e) => setSaleRep(e.target.value)}>{selectSaleRep}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Sale Return Report</label>
                                        <div className="col-sm-6">
                                            <select value={saleRRep} onChange={(e) => setSaleRRep(e.target.value)}>{selectSaleRRep}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Balance Sheet</label>
                                        <div className="col-sm-6">
                                            <select value={balSheet} onChange={(e) => setBalSheet(e.target.value)}>{selectBalSheet}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Item Limit Report</label>
                                        <div className="col-sm-6">
                                            <select value={iLmtRep} onChange={(e) => setILmtRep(e.target.value)}>{selectILmtRep}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Item Trend Report</label>
                                        <div className="col-sm-6">
                                            <select value={iTrendRep} onChange={(e) => setITrendRep(e.target.value)}>{selectITrendRep}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Monthly Sale</label>
                                        <div className="col-sm-6">
                                            <select value={MonthlySale} onChange={(e) => setMonthlySale(e.target.value)}>{selectMonthlySale}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Item Sale Purchase DateWise</label>
                                        <div className="col-sm-6">
                                            <select value={iSPD} onChange={(e) => setISPD(e.target.value)}>{selectISPD}</select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-6 col-form-label" htmlFor="Name">Sale Agent Trend</label>
                                        <div className="col-sm-6">
                                            <select value={saleAT} onChange={(e) => setSaleAT(e.target.value)}>{selectSaleAT}</select>
                                        </div>
                                    </div>

                                </div>
                            </div>








                            <div>
                                <button className="btn btn-primary" type="submit">Update</button>

                            </div>
                        </form>
                    </div>
                </div>
                :
                "Access denied for the screen"}
        </div>
    );
}
const mapStateToProps = state => ({
    currentUser: state.user.user.user,
    roleData: state.role.roles
})
const mapDispatchToProps = dispatch => ({
    fetchRoleStartAsync: () => dispatch(fetchRoleStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAccess);
