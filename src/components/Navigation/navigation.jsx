import React, { useState, useLayoutEffect, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import "../../App.css";
import monthlySale from '../Report/monthlySale';

const Navigation = (props) => {
  console.log(props);
  const currentUser = useSelector((state) => state.user.user.user);
  const [addBrand, setAddBrand] = useState();
  const [searchBrand, setSearchBrand] = useState();
  const [addCat, setAddCat] = useState();
  const [searchCat, setSearchCat] = useState();
  const [addSubCat, setAddSubCat] = useState();
  const [searchSubCat, setSearchSubCat] = useState();
  const [addItem, setAddItem] = useState();
  const [searchItem, setSearchItem] = useState();
  const [purInv, setPurInv] = useState("");
  const [editPurInv, setEditPurInv] = useState("");
  const [movStk, setMovStk] = useState();
  const [saleInvoice, setSaleInvoice] = useState();
  const [saleReturn, setSaleReturn] = useState();
  const [editSaleInv, setEditSaleInv] = useState("");
  const [pricing, setPricing] = useState();
  const [aR, setAR] = useState();
  const [aP, setAP] = useState();
  const [addExpense, setAddExpense] = useState();
  const [addUser, setAddUser] = useState();
  const [searchUser, setSearchUser] = useState();
  const [addRole, setAddRole] = useState();
  const [updateAccess, setUpdateAccess] = useState();
  const [addCashFlow, setAddCashFlow] = useState();
  const [cashAR, setCashAR] = useState();
  const [cashAP, setCashAP] = useState();
  const [stkRep, setStkRep] = useState();
  const [purRep, setPurRep] = useState();
  const [saleRep, setSaleRep] = useState();
  const [saleRRep, setSaleRRep] = useState();
  const [balSheet, setBalSheet] = useState();
  const [iLmtRep, setILmtRep] = useState();
  const [iTrendRep, setITrendRep] = useState();
  const [monthlySale, setMonthlySale] = useState();
  const [iSPD, setISPD] = useState();
  const [saleAT, setSaleAT] = useState();
  const [saleEditReport,setSaleEditReport] = useState();
  const [invMismatchReport,setInvMismatchReport] = useState();
  const [saleSaleDetailMismatchReport,setSaleSaleDetailMismatchReport]=useState();
  const [itemCountDailySheetReport,setItemCountDailySheetReport]=useState();


  useEffect(() => {
    currentUser.rights.map((role, index) => {
      //<li key={index}>{role.split(',')}</li>
      var str = role.split(',');
      console.log(str[0])
      if (str[0] == "ADD BRAND" && str[1] == "TRUE") { setAddBrand("TRUE") }
      else if (str[0] == "SEARCH BRAND" && str[1] ==  "TRUE") { setSearchBrand("TRUE") }
      else if (str[0] ==  "ADD CATEGORY" && str[1] ==  "TRUE") { setAddCat("TRUE") }
      else if (str[0] ==  "SEARCH CATEGORY" && str[1] ==  "TRUE") { setSearchCat("TRUE") }
      else if (str[0] ==  "ADD SUBCATEGORY" && str[1] ==  "TRUE") { setAddSubCat("TRUE") }
      else if (str[0] ==  "SEARCH SUBCATEGORY" && str[1] ==  "TRUE") { setSearchSubCat("TRUE") }
      else if (str[0] ==  "ADD ITEM" && str[1] ==  "TRUE") { setAddItem("TRUE") }
      else if (str[0] ==  "SEARCH ITEM" && str[1] ==  "TRUE") { setSearchItem("TRUE") }
      else if (str[0] ==  "PURCHASE INVOICE" && str[1] ==  "TRUE") { setPurInv("TRUE") }
      else if (str[0] ==  "UPDATE PURCHASE" && str[1] ==  "TRUE") { setEditPurInv("TRUE") }
      else if (str[0] ==  "MOVE STOCK" && str[1] ==  "TRUE") { setMovStk("TRUE") }
      else if (str[0] ==  "SALE INVOICE" && str[1] ==  "TRUE") { setSaleInvoice("TRUE") }
      else if (str[0] ==  "SALE RETURN" && str[1] ==  "TRUE") { setSaleReturn("TRUE") }
      else if (str[0] ==  "UPDATE SALE" && str[1] ==  "TRUE") { setEditSaleInv("TRUE") }
      else if (str[0] ==  "PRICING" && str[1] ==  "TRUE") { setPricing("TRUE") }
      else if (str[0] ==  "ACCOUNT RECEIVABLE" && str[1] ==  "TRUE") { setAR("TRUE") }
      else if (str[0] ==  "ACCOUNT PAYABLE" && str[1] ==  "TRUE") { setAP("TRUE") }
      else if (str[0] ==  "ADD EXPENSE" && str[1] ==  "TRUE") { setAddExpense("TRUE") }
      else if (str[0] ==  "ADD USER" && str[1] ==  "TRUE") { setAddUser("TRUE") }
      else if (str[0] ==  "SEARCH USER" && str[1] ==  "TRUE") { setSearchUser("TRUE") }
      else if (str[0] ==  "ADD ROLE" && str[1] ==  "TRUE") { setAddRole("TRUE") }
      else if (str[0] ==  "UPDATE ACCESS" && str[1] ==  "TRUE") { setUpdateAccess("TRUE") }
      else if (str[0] ==  "ADD CASHFLOW" && str[1] ==  "TRUE") { setAddCashFlow("TRUE") }
      else if (str[0] ==  "CASHFLOW AR" && str[1] ==  "TRUE") { setCashAR("TRUE") }
      else if (str[0] ==  "CASHFLOW AP" && str[1] ==  "TRUE") { setCashAP("TRUE") }
      else if (str[0] ==  "STOCK REPORT" && str[1] ==  "TRUE") { setStkRep("TRUE") }
      else if (str[0] ==  "PURCHASE REPORT" && str[1] ==  "TRUE") { setPurRep("TRUE") }
      else if (str[0] ==  "SALE REPORT" && str[1] ==  "TRUE") { setSaleRep("TRUE") }
      else if (str[0] ==  "SALERETURN REPORT" && str[1] ==  "TRUE") { setSaleRRep("TRUE") }
      else if (str[0] ==  "BALANCESHEET" && str[1] ==  "TRUE") { setBalSheet("TRUE") }
      else if (str[0] ==  "ITEMLIMIT REPORT" && str[1] ==  "TRUE") { setILmtRep("TRUE") }
      else if (str[0] ==  "ITEMTREND REPORT" && str[1] ==  "TRUE") { setITrendRep("TRUE") }
      else if (str[0] ==  "MONTHLYSALE" && str[1] ==  "TRUE") { setMonthlySale("TRUE") }
      else if (str[0] ==  "ITEMSALEPURDATEWISE" && str[1] ==  "TRUE") { setISPD("TRUE") }
      else 
      { setSaleEditReport("TRUE")
        setInvMismatchReport("TRUE")
        setSaleSaleDetailMismatchReport("TRUE")
        setItemCountDailySheetReport("TRUE")
      }
      

    }
    )

  }, [])



  return (

    <div>


      <Navbar className="color-nav" variant="dark" expand="sm">
        <Navbar.Brand href="/">Online Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Site Management" id="basic-nav-dropdown">
              <NavDropdown.Item href="/ManageHeader">Manage Header</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Manage Items" id="basic-nav-dropdown">
              {addBrand === "TRUE" ? <NavDropdown.Item href="/AddBrand">Add Brand</NavDropdown.Item> : ""}
              {searchBrand === "TRUE" ?<NavDropdown.Item href="/SearchBrand">Search Brand</NavDropdown.Item>:""}
              {addCat === "TRUE" ?<NavDropdown.Item href="/AddCategory">Add Category</NavDropdown.Item>:""}
              {searchCat === "TRUE" ?<NavDropdown.Item href="/SearchCategory">Search Category</NavDropdown.Item>:""}
              {addSubCat === "TRUE" ?<NavDropdown.Item href="/AddSubCategory">Add SubCategory</NavDropdown.Item>:""}
              {searchSubCat === "TRUE" ? <NavDropdown.Item href="/SearchSubCategory">Search SubCategory</NavDropdown.Item>:""}
              {addItem === "TRUE" ?<NavDropdown.Item href="/AddItem">Add Item</NavDropdown.Item>:""}
              {searchItem ==="TRUE" ?<NavDropdown.Item href="/SearchItem">Search Item</NavDropdown.Item>:""}
            </NavDropdown>
            <NavDropdown title="Inventory Management" id="basic-nav-dropdown">
              {purInv==="TRUE" ?<NavDropdown.Item href="/PurchaseInvoice">Purchase Invoice</NavDropdown.Item>:""}
              {editPurInv === "TRUE" ?<NavDropdown.Item href="/PurchaseEdit">Edit Purchase</NavDropdown.Item>:""}
              {movStk === "TRUE"?<NavDropdown.Item href="/MoveStock">Move Stock</NavDropdown.Item>:""}
              {saleInvoice ==="TRUE"?<NavDropdown.Item href="/SaleInvoice">Sale Invoice</NavDropdown.Item>:""}
              {saleReturn === "TRUE"?<NavDropdown.Item href="/SaleReturn">Sale Return</NavDropdown.Item>:""}
              {editSaleInv === "TRUE" ?<NavDropdown.Item href="/EditSale">Edit Sale</NavDropdown.Item>:""}
              {pricing ==="TRUE" ?<NavDropdown.Item href="/Pricing">Pricing</NavDropdown.Item>:""}
              {aR === "TRUE"? <NavDropdown.Item href="/AccountReceivable">Account Receivable</NavDropdown.Item>:""}
              {aP === "TRUE"?<NavDropdown.Item href="/AccountPayable">Account Payable</NavDropdown.Item>:""}
              {addExpense === "TRUE"?<NavDropdown.Item href="/AddExpense">Add Expense</NavDropdown.Item>:""}
            </NavDropdown>
            <NavDropdown title="User Management" id="basic-nav-dropdown">
              {addUser ==="TRUE"?<NavDropdown.Item href="/AddUser">Add User</NavDropdown.Item>:""}
              {searchUser === "TRUE" ?<NavDropdown.Item href="/SearchUser">Search User</NavDropdown.Item>:""}
              {addRole === "TRUE" ?<NavDropdown.Item href="/AddRole">Add Role</NavDropdown.Item>:""}
              {updateAccess === "TRUE" ?<NavDropdown.Item href="/UpdateAccess">Update Access</NavDropdown.Item>:""}
            </NavDropdown>
            <NavDropdown title="Cash Management" id="basic-nav-dropdown">
              {addCashFlow === "TRUE" ?<NavDropdown.Item href="/AddCashFlow">Add Cash Flow</NavDropdown.Item>:""}
              {cashAR === "TRUE" ?<NavDropdown.Item href="/AR">Account Receivable</NavDropdown.Item>:""}
              {cashAP === "TRUR" ?<NavDropdown.Item href="/AP">Account Payable</NavDropdown.Item>:""}
            </NavDropdown>
            <NavDropdown title="Reports" id="basic-nav-dropdown">
              {stkRep === "TRUE" ?<NavDropdown.Item href="/StockReport">Stock Report</NavDropdown.Item>:""}
              {purRep === "TRUE" ?<NavDropdown.Item href="/PurchaseReport">Purchase Report</NavDropdown.Item>:""}
              {saleRep === "TRUE" ?<NavDropdown.Item href="/SaleReport">Sale Report</NavDropdown.Item>:""}
              {saleRRep === "TRUE" ?<NavDropdown.Item href="/SaleReturnReport">Sale Return Report</NavDropdown.Item>:""}
              {saleEditReport === "TRUE" ?<NavDropdown.Item href="/SaleEditReport">Sale Edit Report</NavDropdown.Item>:""}
              {invMismatchReport === "TRUE" ?<NavDropdown.Item href="/InvMismatchReport">Inventory Mismatch Report</NavDropdown.Item>:""}
              {saleSaleDetailMismatchReport === "TRUE" ?<NavDropdown.Item href="/SaleSaleDetailMismatchReport">Sale Sale Detail Mismatch Report</NavDropdown.Item>:""}
              {balSheet === "TRUE" ?<NavDropdown.Item href="/BalanceSheetReport">Balance Sheet</NavDropdown.Item>:""}
              {iLmtRep === "TRUE" ?<NavDropdown.Item href="/ItemLimitReport">Item Limit Report</NavDropdown.Item>:""}
              {iTrendRep === "TRUE" ?<NavDropdown.Item href="/ItemTrendReport">Item Trend Report</NavDropdown.Item>:""}
              {itemCountDailySheetReport==="TRUE" ?<NavDropdown.Item href="/ItemCountDailyReport">Item Count Daily Report</NavDropdown.Item>:""}
              {monthlySale === "TRUE" ?<NavDropdown.Item href="/MonthlySaleReport">Monthly Sale</NavDropdown.Item>:""}
              {iSPD === "TRUE"?<NavDropdown.Item href="/ItemSalePurchaseDateWise">Item Sale Purchase Datewise</NavDropdown.Item>:""}
              {saleAT === "TRUE"?<NavDropdown.Item href="/SaleAgentReport">Sale Agent Trend</NavDropdown.Item>:""}
            </NavDropdown>
            <NavDropdown title="Carts Management" id="basic-nav-dropdown">
              <NavDropdown.Item href="/cartDetails">View Carts</NavDropdown.Item>
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>

      </Navbar>
    </div>

  )
}

export default withRouter(Navigation);