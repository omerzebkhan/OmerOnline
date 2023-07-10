import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav,NavDropdown } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import "../../App.css";

const Navigation = (props) => {
    console.log(props);
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
                <NavDropdown.Item href="/AddBrand">Add Brand</NavDropdown.Item>
                <NavDropdown.Item href="/SearchBrand">Search Brand</NavDropdown.Item>
                <NavDropdown.Item href="/AddCategory">Add Category</NavDropdown.Item>
                <NavDropdown.Item href="/SearchCategory">Search Category</NavDropdown.Item>
                <NavDropdown.Item href="/AddSubCategory">Add SubCategory</NavDropdown.Item>
                <NavDropdown.Item href="/SearchSubCategory">Search SubCategory</NavDropdown.Item>
                <NavDropdown.Item href="/AddItem">Add Item</NavDropdown.Item>
                <NavDropdown.Item href="/SearchItem">Search Item</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Inventory Management" id="basic-nav-dropdown">
                <NavDropdown.Item href="/PurchaseInvoice">Purchase Invoice</NavDropdown.Item>
                <NavDropdown.Item href="/PurchaseEdit">Edit Purchase</NavDropdown.Item>
                <NavDropdown.Item href="/MoveStock">Move Stock</NavDropdown.Item>
                <NavDropdown.Item href="/SaleInvoice">Sale Invoice</NavDropdown.Item>
                <NavDropdown.Item href="/SaleReturn">Sale Return</NavDropdown.Item>
                <NavDropdown.Item href="/EditSale">Edit Sale</NavDropdown.Item>
                <NavDropdown.Item href="/Pricing">Pricing</NavDropdown.Item>
                <NavDropdown.Item href="/AccountReceivable">Account Receivable</NavDropdown.Item>
                <NavDropdown.Item href="/AccountPayable">Account Payable</NavDropdown.Item>
                <NavDropdown.Item href="/AddExpense">Add Expense</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="User Management" id="basic-nav-dropdown">
                <NavDropdown.Item href="/AddUser">Add User</NavDropdown.Item>
                <NavDropdown.Item href="/SearchUser">Search User</NavDropdown.Item>
                <NavDropdown.Item href="/AddRole">Add Role</NavDropdown.Item>
                <NavDropdown.Item href="/UpdateAccess">Update Access</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Cash Management" id="basic-nav-dropdown">
                <NavDropdown.Item href="/AddCashFlow">Add Cash Flow</NavDropdown.Item>
                <NavDropdown.Item href="/AR">Account Receivable</NavDropdown.Item>
                <NavDropdown.Item href="/AP">Account Payable</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Reports" id="basic-nav-dropdown">
                <NavDropdown.Item href="/StockReport">Stock Report</NavDropdown.Item>
                <NavDropdown.Item href="/PurchaseReport">Purchase Report</NavDropdown.Item>
                <NavDropdown.Item href="/SaleReport">Sale Report</NavDropdown.Item>
                <NavDropdown.Item href="/SaleReturnReport">Sale Return Report</NavDropdown.Item>
                <NavDropdown.Item href="/BalanceSheetReport">Balance Sheet</NavDropdown.Item>
                <NavDropdown.Item href="/ItemLimitReport">Item Limit Report</NavDropdown.Item>
                <NavDropdown.Item href="/ItemTrendReport">Item Trend Report</NavDropdown.Item>
                <NavDropdown.Item href="/MonthlySaleReport">Monthly Sale</NavDropdown.Item>
                <NavDropdown.Item href="/ItemSalePurchaseDateWise">Item Sale Purchase Datewise</NavDropdown.Item>
                <NavDropdown.Item href="/SaleAgentReport">Sale Agent Trend</NavDropdown.Item>
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