import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// --- Import your components ---
import AddBrand from "./components/brand/brand.component";
import SearchBrand from "./components/brand/search-brand.component";
import AddCategory from "./components/category/category.component";
import SearchCategory from "./components/category/search-category.component";
import AddSubCategory from "./components/sub-category/add-subCategory.component";
import SearchSubCategory from "./components/sub-category/search-subCategory.component";
import AddItem from "./components/item/additem.component";
import SearchItem from "./components/item/searchitem.component";
import PurchaseInvoice from "./components/inventory-management/purchase-invoice.component";
import PurchaseEdit from "./components/inventory-management/editPurchase.component";
import MoveStock from "./components/inventory-management/move-stock.component";
import SaleInvoice from "./components/inventory-management/sale-invoice.component";
import SaleReturn from "./components/inventory-management/SaleReturn.component";
import EditSale from "./components/inventory-management/editSale.component";
import Pricing from "./components/inventory-management/pricing.component";
import AccountReceivable from "./components/inventory-management/accountReceivable.component";
import AccountPayable from "./components/inventory-management/accountPayable.component";
import StockReport from "./components/Report/stockReport.component";
import PurchaseReport from "./components/Report/purchaseReport.component";
import SaleReport from "./components/Report/saleReport.component";
import BalanceSheetReport from "./components/Report/balanceSheet.component";
import ItemLimitReport from "./components/Report/itemLimitReport.component";
import ItemTrendReport from "./components/Report/sellingItemTrend";
import ItemSalePurchaseDateWise from "./components/Report/itemSalePurchaseDateWise";
import SaleReturnReport from "./components/Report/returnReport.component";
import MonthlySaleReport from "./components/Report/monthlySale";
import SaleAgentTrendReport from "./components/Report/saleAgentTrend.component";
import AddUser from "./components/user/addUser.component";
import SearchUser from "./components/user/searchUser.component";
import AddRole from "./components/user/addRole.component";
import UpdateAccess from "./components/user/updateAccess.component";
import AddExpense from "./components/expense/expense.component";
import ItemList from "./components/landingpage/item-list.component";
import ItemDetail from "./components/item/itemDetail.component";
import MyCart from "./components/landingpage/CartDetail.component";
import CartDetails from "./components/cartManagement/manageCart.component";
import CashFlow from "./components/expense/cashFlow.component";
import CashFlowAR from "./components/expense/cashFlowAR.component";
import CashFlowAP from "./components/expense/cashFlowAP.component";
import SaleEditReport from "./components/Report/editSaleReport.component";
import InventoryMismatchReport from "./components/Report/inventoryMismatchReport.component";
import SaleSaleDetailMismatchReport from "./components/Report/saleSaleDetailMismatch.component";
import ItemCountDailySheetReport from "./components/Report/itemCountDailySheet.component";
import PurchaseEditReport from "./components/Report/editPurchaseReport.component";

import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import BoardUser from "./components/BoardUser";
import VerifyUser from "./components/VerifyUser";
import BoardAdmin from "./components/BoardAdmin";

import { logout, clearMessage } from "./redux/user/user.action";

// --- Helper hook to clear messages on route change ---
function useClearMessageOnRouteChange(dispatch) {
  const location = useLocation();
  useEffect(() => {
    dispatch(clearMessage());
  }, [location, dispatch]);
}

const App = () => {
  const [showPurchaseAgent, setShowPurchaseAgent] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showUserBoard, setShowUserBoard] = useState(false);
  const [showSaleAgentBoard, setShowSaleAgentBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useClearMessageOnRouteChange(dispatch);

  useEffect(() => {
    if (currentUser) {
      setShowPurchaseAgent(currentUser.roles.includes("ROLE_PURCHASEAGENT"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
      setShowUserBoard(currentUser.roles.includes("ROLE_USER"));
      setShowSaleAgentBoard(currentUser.roles.includes("ROLE_SALEAGENT"));
    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <div className="appBackground">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to="/" className="navbar-brand">
          Online Store {import.meta.env.VITE_COMPANYNAME}
        </Link>

        <div className="navbar-nav mr-auto">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
          <Link to="/verifyUser" className="nav-link">Verify</Link>

          {showPurchaseAgent && <Link to="/aPa" className="nav-link">Purchase Agent</Link>}
          {showAdminBoard && <Link to="/admin" className="nav-link">Admin Board</Link>}
          {showSaleAgentBoard && <Link to="/admin" className="nav-link">Sale Agent</Link>}
          {showUserBoard && <Link to="/user" className="nav-link">User</Link>}
        </div>

        <div className="navbar-nav ml-auto">
          {currentUser ? (
            <>
              <Link to="/profile" className="nav-link">{currentUser.username}</Link>
              <Link to="/myCart" className="nav-link">MyCart</Link>
              <a href="/login" className="nav-link" onClick={logOut}>LogOut</a>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </nav>

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verifyUser" element={<VerifyUser />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/admin" element={<BoardAdmin />} />
          <Route path="/aPa" element={<BoardAdmin />} />
          {/* Add all other routes here */}
          <Route path="/AddBrand" element={<AddBrand/>} />
                    <Route path="/SearchBrand" element={<SearchBrand />} />
                    <Route path="/AddCategory" element={<AddCategory />} />
                    <Route path="/SearchCategory" element={<SearchCategory />} />
                    <Route path="/AddSubCategory" element={<AddSubCategory />} />
                    <Route path="/SearchSubCategory" element={<SearchSubCategory />} />
                    <Route path="/AddItem" element={<AddItem />} />
                    <Route path="/SearchItem" element={<SearchItem />} />
                    <Route path="/AddUser" element={<AddUser />}/>
                    <Route path="/SearchUser" element={<SearchUser />}/>
                    <Route path="/PurchaseInvoice" element={<PurchaseInvoice />} />
                    <Route path="/PurchaseEdit" element={<PurchaseEdit />} />
                    <Route path="/MoveStock" element={<MoveStock  />} />
                    <Route path="/SaleInvoice" element={<SaleInvoice  />} />
                    <Route path="/SaleReturn" element={<SaleReturn  />} />
                    <Route path="/EditSale" element={<EditSale  />} />
                    <Route path="/Pricing" element={<Pricing  />} />
                    <Route path="/AccountReceivable" element={<AccountReceivable/>}/>
                    <Route path="/AccountPayable" element={<AccountPayable/>}/>
                    <Route path="/StockReport" element={<StockReport />} />
                    <Route path="/PurchaseReport" element={<PurchaseReport />}/>
                    <Route path="/SaleReport" element={<SaleReport />}/> 
                    <Route path="/BalanceSheetReport" element={<BalanceSheetReport />}/> 
                    <Route path="/ItemLimitReport" element={<ItemLimitReport />}/>
                    <Route path="/ItemTrendReport" element={<ItemTrendReport />}/>
                    <Route path="/ItemSalePurchaseDateWise" element={<ItemSalePurchaseDateWise />}/>
                    <Route path="/SaleReturnReport" element={<SaleReturnReport />}/>
                    <Route path="/MonthlySaleReport" element={<MonthlySaleReport />}/>
                    <Route path="/SaleAgentReport" element={<SaleAgentTrendReport />}/>
                    <Route path="/AddRole" element={<AddRole />}/>
                    <Route path="/UpdateAccess" element={<UpdateAccess />}/> 
                    <Route path="/AddExpense" element={<AddExpense />}/> 
                    <Route path="/ItemList" element={<ItemList />}/> 
                    <Route path="/ItemDetail" element={<ItemDetail />}/>
                    <Route path="/myCart" element={<MyCart />}/>
                    <Route path="/cartDetails" element={<CartDetails />}/>
                    <Route path="/AddCashFlow" element={<CashFlow />}/>
                    <Route path="/AR" element={<CashFlowAR />}/>
                    <Route path="/AP" element={<CashFlowAP />}/>
                    <Route path="/SaleEditReport" element={<SaleEditReport />}/>
                    <Route path="/InvMismatchReport" element={<InventoryMismatchReport />}/>
                    <Route path="/ItemCountDailyReport" element={<ItemCountDailySheetReport />}/>
                    <Route path="/SaleSaleDetailMismatchReport" element={<SaleSaleDetailMismatchReport />}/>
                    <Route path="/PurchaseEditReport" element={<PurchaseEditReport />}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
