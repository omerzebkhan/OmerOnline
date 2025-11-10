import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import AddBrand from '../brand/brand.component';
import SearchBrand from '../brand/search-brand.component'
import AddCategory from '../category/category.component';
import SearchCategory from '../category/search-category.component';
import AddSubCategory from '../sub-category/add-subCategory.component'
import SearchSubCategory from '../sub-category/search-subCategory.component';
import AddItem from '../item/additem.component'
import SearchItem from '../item/searchitem.component';
import PurchaseInvoice from '../inventory-management/purchase-invoice.component';
import MoveStock from '../inventory-management/move-stock.component';
// import SaleInvoice from '../inventory-management/sale-invoice.component';
// import SaleReturn from '../inventory-management/SaleReturn.component'
// import Pricing from '../inventory-management/pricing.component';
// import AccountReceivable from '../inventory-management/accountReceivable.component';
// import AccountPayable from '../inventory-management/accountPayable.component';
// import StockReport from '../Report/stockReport.component';
// import PurchaseReport from '../Report/purchaseReport.component';
// import SaleReport from '../Report/saleReport.component';
// import BalanceSheetReport from '../Report/balanceSheet.component';
// import LandingPage from '../../landingpage/landingpage.component';
// import ItemList from '../../landingpage/item-list.component';
// import ManageHeader from '../site-management/manage-header.component';


import AddUser from '../user/addUser.component';
import SearchUser from '../user/searchUser.component';
import { history } from "../../helper/history";



export default class Routes extends Component {
    render() {
        return (

            <BrowserRouter history={history}>
                <Switch>
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
                    <Route path="/MoveStock" render={() => <MoveStock  />} />
                   
                </Switch>
            </BrowserRouter>


            /* 
             
             <Route path="/LandingPage" render={() => <LandingPage />} />
             <Route path="/ItemList" render={() => <ItemList />} />
             <Route path="/ManageHeader" render={() => <ManageHeader />} />
             
             
            
              */




        )
    }
}