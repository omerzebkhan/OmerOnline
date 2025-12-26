import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../App.css";

const OnlineCustomerNav = () => (
  <Navbar className="color-nav" variant="dark" expand="sm">
    <Navbar.Brand as={Link} to="/">Online Store</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">

        <NavDropdown title="Carts Management" id="carts-management-dropdown">
          <NavDropdown.Item as={Link} to="/cartDetails">View Carts</NavDropdown.Item>
        </NavDropdown>

      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const Navigation = () => {
  const currentUser = useSelector((state) => state.user.user);
  const [permissions, setPermissions] = useState({});

  const isOnlineCustomer =
    currentUser?.roles?.includes("ROLE_ONLINECUSTOMER");

  // If user is online customer → show simple nav
  if (isOnlineCustomer) {
    return <OnlineCustomerNav />;
  }

  useEffect(() => {
    if (!currentUser || !currentUser.rights) return;

    const perms = {};
    currentUser.rights.forEach(role => {
      const [key, value] = role.split(',');
      perms[key] = value === "TRUE";
    });
    setPermissions(perms);
  }, [currentUser]);

  return (
    <Navbar className="color-nav" variant="dark" expand="sm">
      <Navbar.Brand as={Link} to="/">Online Store</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">

          {/* Site Management */}
          <NavDropdown title="Site Management" id="site-management-dropdown">
            <NavDropdown.Item as={Link} to="/ManageHeader">Manage Header</NavDropdown.Item>
          </NavDropdown>

          {/* Manage Items */}
          <NavDropdown title="Manage Items" id="manage-items-dropdown">
            {permissions["ADD BRAND"] && <NavDropdown.Item as={Link} to="/AddBrand">Add Brand</NavDropdown.Item>}
            {permissions["SEARCH BRAND"] && <NavDropdown.Item as={Link} to="/SearchBrand">Search Brand</NavDropdown.Item>}
            {permissions["ADD CATEGORY"] && <NavDropdown.Item as={Link} to="/AddCategory">Add Category</NavDropdown.Item>}
            {permissions["SEARCH CATEGORY"] && <NavDropdown.Item as={Link} to="/SearchCategory">Search Category</NavDropdown.Item>}
            {permissions["ADD SUBCATEGORY"] && <NavDropdown.Item as={Link} to="/AddSubCategory">Add SubCategory</NavDropdown.Item>}
            {permissions["SEARCH SUBCATEGORY"] && <NavDropdown.Item as={Link} to="/SearchSubCategory">Search SubCategory</NavDropdown.Item>}
            {permissions["ADD ITEM"] && <NavDropdown.Item as={Link} to="/AddItem">Add Item</NavDropdown.Item>}
            {permissions["SEARCH ITEM"] && <NavDropdown.Item as={Link} to="/SearchItem">Search Item</NavDropdown.Item>}
          </NavDropdown>

          {/* Inventory Management */}
          <NavDropdown title="Inventory Management" id="inventory-management-dropdown">
            {permissions["PURCHASE INVOICE"] && <NavDropdown.Item as={Link} to="/PurchaseInvoice">Purchase Invoice</NavDropdown.Item>}
            {permissions["UPDATE PURCHASE"] && <NavDropdown.Item as={Link} to="/PurchaseEdit">Edit Purchase</NavDropdown.Item>}
            {permissions["MOVE STOCK"] && <NavDropdown.Item as={Link} to="/MoveStock">Move Stock</NavDropdown.Item>}
            {permissions["SALE INVOICE"] && <NavDropdown.Item as={Link} to="/SaleInvoice">Sale Invoice</NavDropdown.Item>}
            {permissions["SALE RETURN"] && <NavDropdown.Item as={Link} to="/SaleReturn">Sale Return</NavDropdown.Item>}
            {permissions["UPDATE SALE"] && <NavDropdown.Item as={Link} to="/EditSale">Edit Sale</NavDropdown.Item>}
            {permissions["PRICING"] && <NavDropdown.Item as={Link} to="/Pricing">Pricing</NavDropdown.Item>}
            {permissions["ACCOUNT RECEIVABLE"] && <NavDropdown.Item as={Link} to="/AccountReceivable">Account Receivable</NavDropdown.Item>}
            {permissions["ACCOUNT PAYABLE"] && <NavDropdown.Item as={Link} to="/AccountPayable">Account Payable</NavDropdown.Item>}
            {permissions["ADD EXPENSE"] && <NavDropdown.Item as={Link} to="/AddExpense">Add Expense</NavDropdown.Item>}
          </NavDropdown>

          {/* User Management */}
          <NavDropdown title="User Management" id="user-management-dropdown">
            {permissions["ADD USER"] && <NavDropdown.Item as={Link} to="/AddUser">Add User</NavDropdown.Item>}
            {permissions["SEARCH USER"] && <NavDropdown.Item as={Link} to="/SearchUser">Search User</NavDropdown.Item>}
            {permissions["ADD ROLE"] && <NavDropdown.Item as={Link} to="/AddRole">Add Role</NavDropdown.Item>}
            {permissions["UPDATE ACCESS"] && <NavDropdown.Item as={Link} to="/UpdateAccess">Update Access</NavDropdown.Item>}
          </NavDropdown>

          {/* Cash Management */}
          <NavDropdown title="Cash Management" id="cash-management-dropdown">
            {permissions["ADD CASHFLOW"] && <NavDropdown.Item as={Link} to="/AddCashFlow">Add Cash Flow</NavDropdown.Item>}
            {permissions["CASHFLOW AR"] && <NavDropdown.Item as={Link} to="/AR">Account Receivable</NavDropdown.Item>}
            {permissions["CASHFLOW AP"] && <NavDropdown.Item as={Link} to="/AP">Account Payable</NavDropdown.Item>}
          </NavDropdown>

          {/* Reports */}
          <NavDropdown title="Reports" id="reports-dropdown">
            {permissions["STOCK REPORT"] && <NavDropdown.Item as={Link} to="/StockReport">Stock Report</NavDropdown.Item>}
            {permissions["PURCHASE REPORT"] && <NavDropdown.Item as={Link} to="/PurchaseReport">Purchase Report</NavDropdown.Item>}
            {permissions["EDITPURCHASE REPORT"] && <NavDropdown.Item as={Link} to="/PurchaseEditReport">Purchase Edit Report</NavDropdown.Item>}
            {permissions["SALE REPORT"] && <NavDropdown.Item as={Link} to="/SaleReport">Sale Report</NavDropdown.Item>}
            {permissions["SALERETURN REPORT"] && <NavDropdown.Item as={Link} to="/SaleReturnReport">Sale Return Report</NavDropdown.Item>}
            {permissions["EDITSALE REPORT"] && <NavDropdown.Item as={Link} to="/SaleEditReport">Sale Edit Report</NavDropdown.Item>}
            {permissions["INVENTORYMISMATCH REPORT"] && <NavDropdown.Item as={Link} to="/InvMismatchReport">Inventory Mismatch Report</NavDropdown.Item>}
            {permissions["SALEDETAILMISMATCH REPORT"] && <NavDropdown.Item as={Link} to="/SaleSaleDetailMismatchReport">Sale Detail Mismatch Report</NavDropdown.Item>}
            {permissions["BALANCESHEET"] && <NavDropdown.Item as={Link} to="/BalanceSheetReport">Balance Sheet</NavDropdown.Item>}
            {permissions["ITEMLIMIT REPORT"] && <NavDropdown.Item as={Link} to="/ItemLimitReport">Item Limit Report</NavDropdown.Item>}
            {permissions["ITEMTREND REPORT"] && <NavDropdown.Item as={Link} to="/ItemTrendReport">Item Trend Report</NavDropdown.Item>}
            {permissions["ITEMCOUNT DAILY REPORT"] && <NavDropdown.Item as={Link} to="/ItemCountDailyReport">Item Count Daily Report</NavDropdown.Item>}
            {permissions["MONTHLYSALE"] && <NavDropdown.Item as={Link} to="/MonthlySaleReport">Monthly Sale</NavDropdown.Item>}
            {permissions["ITEMSALEPURDATEWISE"] && <NavDropdown.Item as={Link} to="/ItemSalePurchaseDateWise">Item Sale Purchase Datewise</NavDropdown.Item>}
            {permissions["SALE AGENT TREND"] && <NavDropdown.Item as={Link} to="/SaleAgentReport">Sale Agent Trend</NavDropdown.Item>}
          </NavDropdown>

          {/* Carts */}
          <NavDropdown title="Carts Management" id="carts-management-dropdown">
            <NavDropdown.Item as={Link} to="/cartDetails">View Carts</NavDropdown.Item>
          </NavDropdown>

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
