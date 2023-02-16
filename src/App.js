import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


import AddBrand from './components/brand/brand.component';
import SearchBrand from './components/brand/search-brand.component'
import AddCategory from './components/category/category.component';
import SearchCategory from './components/category/search-category.component';
import AddSubCategory from './components/sub-category/add-subCategory.component'
import SearchSubCategory from './components/sub-category/search-subCategory.component';
import AddItem from './components/item/additem.component'
import SearchItem from './components/item/searchitem.component';
import PurchaseInvoice from './components/inventory-management/purchase-invoice.component';
import PurchaseEdit from './components/inventory-management/editPurchase.component';
import MoveStock from './components/inventory-management/move-stock.component';
import SaleInvoice from './components/inventory-management/sale-invoice.component';
import SaleReturn from './components/inventory-management/SaleReturn.component'
import EditSale from './components/inventory-management/editSale.component';
import Pricing from './components/inventory-management/pricing.component';
import AccountReceivable from './components/inventory-management/accountReceivable.component';
import AccountPayable from './components/inventory-management/accountPayable.component';
import StockReport from './components/Report/stockReport.component';
import PurchaseReport from './components/Report/purchaseReport.component';
import SaleReport from './components/Report/saleReport.component';
import BalanceSheetReport from './components/Report/balanceSheet.component'
import ItemLimitReport from "./components/Report/itemLimitReport.component";
import ItemTrendReport from "./components/Report/sellingItemTrend";
import ItemSalePurchaseDateWise from "./components/Report/itemSalePurchaseDateWise";
import SaleReturnReport from "./components/Report/returnReport.component";
import MonthlySaleReport from "./components/Report/monthlySale";
import SaleAgentTrendReport from "./components/Report/saleAgentTrend.component";
import AddUser from './components/user/addUser.component';
import SearchUser from './components/user/searchUser.component';
import AddRole from './components/user/addRole.component';
import UpdateAccess from './components/user/updateAccess.component'
import AddExpense from './components/expense/expense.component'
// import LandingPage from '../../landingpage/landingpage.component';
import ItemList from './components/landingpage/item-list.component';
// import ManageHeader from '../site-management/manage-header.component';
import ItemDetail from './components/item/itemDetail.component'; //user view
import MyCart from './components/landingpage/CartDetail.component'; //user view
import CashFlow from './components/expense/cashFlow.component'
import CashFlowAR from './components/expense/cashFlowAR.component'
import CashFlowAP from './components/expense/cashFlowAP.component'


import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
//import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

import { logout } from "../src/redux/user/user.action";
import { clearMessage } from "../src/redux/user/user.action";

import { history } from "../src/helper/history";

const App = () => {
  const [showPurchaseAgent, setShowPurchaseAgent] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showUserBoard, setShowUserBoard] = useState(false);
  const { user: currentUser } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
    console.log(`current user = ${currentUser}`)
    setShowPurchaseAgent(currentUser.roles.includes("ROLE_PURCHASEAGENT"));
    setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    setShowUserBoard(currentUser.roles.includes("ROLE_USER"));

    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Router history={history}>
      <div className="appBackground" >
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Online Store
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showPurchaseAgent && (
              <li className="nav-item">
                <Link to={"/aPa"} className="nav-link">
                    Purchase Agent Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {showUserBoard && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/myCart"} className="nav-link">
                  MyCart
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            // redirect to login screen
            //logout()
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>  
            </div>
          )}
        </nav>

        {/* <div className="container mt-3"> */}
         <div >
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
             <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/admin" component={BoardAdmin} />
            <Route path="/aPa" component={BoardAdmin} />
            {/* <Route path="/mod" component={BoardModerator} />
             */}
            <Route path="/AddBrand" render={() => <AddBrand />} />
                    <Route path="/SearchBrand" render={() => <SearchBrand />} />
                    <Route path="/AddCategory" render={() => <AddCategory />} />
                    <Route path="/SearchCategory" render={() => <SearchCategory />} />
                    <Route path="/AddSubCategory" render={() => <AddSubCategory />} />
                    <Route path="/SearchSubCategory" render={() => <SearchSubCategory />} />
                    <Route path="/AddItem" render={() => <AddItem />} />
                    <Route path="/SearchItem" render={() => <SearchItem />} />
                    <Route path="/AddUser" render={()=><AddUser />}/>
                    <Route path="/SearchUser" render={()=><SearchUser />}/>
                    <Route path="/PurchaseInvoice" render={() => <PurchaseInvoice />} />
                    <Route path="/PurchaseEdit" render={() => <PurchaseEdit />} />
                    <Route path="/MoveStock" render={() => <MoveStock  />} />
                    <Route path="/SaleInvoice" render={() => <SaleInvoice  />} />
                    <Route path="/SaleReturn" render={() => <SaleReturn  />} />
                    <Route path="/EditSale" render={() => <EditSale  />} />
                    <Route path="/Pricing" render={() => <Pricing  />} />
                    <Route path="/AccountReceivable" render={()=><AccountReceivable/>}/>
                    <Route path="/AccountPayable" render={()=><AccountPayable/>}/>
                    <Route path="/StockReport" render={() => <StockReport />} />
                    <Route path="/PurchaseReport" render={()=><PurchaseReport />}/>
                    <Route path="/SaleReport" render={()=><SaleReport />}/> 
                    <Route path="/BalanceSheetReport" render={()=><BalanceSheetReport />}/> 
                    <Route path="/ItemLimitReport" render={()=><ItemLimitReport />}/>
                    <Route path="/ItemTrendReport" render={()=><ItemTrendReport />}/>
                    <Route path="/ItemSalePurchaseDateWise" render={()=><ItemSalePurchaseDateWise />}/>
                    <Route path="/SaleReturnReport" render={()=><SaleReturnReport />}/>
                    <Route path="/MonthlySaleReport" render={()=><MonthlySaleReport />}/>
                    <Route path="/SaleAgentReport" render={()=><SaleAgentTrendReport />}/>
                    <Route path="/AddRole" render={()=><AddRole />}/>
                    <Route path="/UpdateAccess" render={()=><UpdateAccess />}/> 
                    <Route path="/AddExpense" render={()=><AddExpense />}/> 
                    <Route path="/ItemList" render={()=><ItemList />}/> 
                    <Route path="/ItemDetail" render={()=><ItemDetail />}/>
                    <Route path="/myCart" render={()=><MyCart />}/>
                    <Route path="/AddCashFlow" render={()=><CashFlow />}/>
                    <Route path="/AR" render={()=><CashFlowAR />}/>
                    <Route path="/AP" render={()=><CashFlowAP />}/>

          </Switch>
        </div>

      </div>
     
    </Router>
  );
};

export default App;