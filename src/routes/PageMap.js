// === AUTH ===
import Login from "../components/Login";
import Home from "../components/Home";
import Profile from "../components/Profile";
import SignUp from "../components/SignUp";
import BoardUser from "../components/BoardUser";
import VerifyUser from "../components/VerifyUser";
import BoardAdmin from "../components/BoardAdmin";

// === INVENTORY & PURCHASE ===
import PurchaseInvoice from "../components/inventory-management/purchase-invoice.component";
import PurchaseEdit from "../components/inventory-management/editPurchase.component";
import MoveStock from "../components/inventory-management/move-stock.component";
import SaleInvoice from "../components/inventory-management/sale-invoice.component";
import SaleReturn from "../components/inventory-management/SaleReturn.component";
import EditSale from "../components/inventory-management/editSale.component";
import Pricing from "../components/inventory-management/pricing.component";
import AccountReceivable from "../components/inventory-management/accountReceivable.component";
import AccountPayable from "../components/inventory-management/accountPayable.component";

// === REPORTS ===
import StockReport from "../components/Report/stockReport.component";
import PurchaseReport from "../components/Report/purchaseReport.component";
import SaleReport from "../components/Report/saleReport.component";
import BalanceSheetReport from "../components/Report/balanceSheet.component";
import ItemLimitReport from "../components/Report/itemLimitReport.component";
import ItemTrendReport from "../components/Report/sellingItemTrend";
import ItemSalePurchaseDateWise from "../components/Report/itemSalePurchaseDateWise";
import SaleReturnReport from "../components/Report/returnReport.component";
import MonthlySaleReport from "../components/Report/monthlySale";
import SaleAgentTrendReport from "../components/Report/saleAgentTrend.component";
import SaleEditReport from "../components/Report/editSaleReport.component";
import InventoryMismatchReport from "../components/Report/inventoryMismatchReport.component";
import ItemCountDailySheetReport from "../components/Report/itemCountDailySheet.component";
import PurchaseEditReport from "../components/Report/editPurchaseReport.component";
import SaleSaleDetailMismatchReport from "../components/Report/saleSaleDetailMismatch.component";

// === BRAND / CATEGORY ===
import AddBrand from "../components/brand/brand.component";
import SearchBrand from "../components/brand/search-brand.component";
import AddCategory from "../components/category/category.component";
import SearchCategory from "../components/category/search-category.component";
import AddSubCategory from "../components/sub-category/add-subCategory.component";
import SearchSubCategory from "../components/sub-category/search-subCategory.component";

// === ITEMS ===
import AddItem from "../components/item/additem.component";
import SearchItem from "../components/item/searchitem.component";
import ItemList from "../components/landingpage/item-list.component";
import ItemDetail from "../components/item/itemDetail.component";

// === USER / ROLE ===
import AddUser from "../components/user/addUser.component";
import SearchUser from "../components/user/searchUser.component";
import AddRole from "../components/user/addRole.component";
import UpdateAccess from "../components/user/updateAccess.component";

// === EXPENSE ===
import AddExpense from "../components/expense/expense.component";
import CashFlow from "../components/expense/cashFlow.component";
import CashFlowAR from "../components/expense/cashFlowAR.component";
import CashFlowAP from "../components/expense/cashFlowAP.component";

// === Cart ===
import MyCart from "../components/landingpage/CartDetail.component";
import CartDetails from "../components/cartManagement/manageCart.component";

// =================================================================
// CENTRAL ROUTE DEFINITION (CLEAN & EASY)
// =================================================================
export const allRoutes = [
  { path: "/", component: Home },
  { path: "/home", component: Home },
  { path: "/login", component: Login },
  { path: "/signup", component: SignUp },
  { path: "/verifyUser", component: VerifyUser },
  { path: "/profile", component: Profile },
  { path: "/user", component: BoardUser },
  { path: "/admin", component: BoardAdmin },
  { path: "/aPa", component: BoardAdmin },

  // BRAND & CATEGORY
  { path: "/AddBrand", component: AddBrand },
  { path: "/SearchBrand", component: SearchBrand },
  { path: "/AddCategory", component: AddCategory },
  { path: "/SearchCategory", component: SearchCategory },
  { path: "/AddSubCategory", component: AddSubCategory },
  { path: "/SearchSubCategory", component: SearchSubCategory },

  // ITEMS
  { path: "/AddItem", component: AddItem },
  { path: "/SearchItem", component: SearchItem },
  { path: "/ItemList", component: ItemList },
  { path: "/ItemDetail", component: ItemDetail },

  // USER / ROLE
  { path: "/AddUser", component: AddUser },
  { path: "/SearchUser", component: SearchUser },
  { path: "/AddRole", component: AddRole },
  { path: "/UpdateAccess", component: UpdateAccess },

  // PURCHASE & SALE
  { path: "/PurchaseInvoice", component: PurchaseInvoice },
  { path: "/PurchaseEdit", component: PurchaseEdit },
  { path: "/MoveStock", component: MoveStock },
  { path: "/SaleInvoice", component: SaleInvoice },
  { path: "/SaleReturn", component: SaleReturn },
  { path: "/EditSale", component: EditSale },
  { path: "/Pricing", component: Pricing },

  // ACCOUNT
  { path: "/AccountReceivable", component: AccountReceivable },
  { path: "/AccountPayable", component: AccountPayable },

  // REPORTS
  { path: "/StockReport", component: StockReport },
  { path: "/PurchaseReport", component: PurchaseReport },
  { path: "/SaleReport", component: SaleReport },
  { path: "/BalanceSheetReport", component: BalanceSheetReport },
  { path: "/ItemLimitReport", component: ItemLimitReport },
  { path: "/ItemTrendReport", component: ItemTrendReport },
  { path: "/ItemSalePurchaseDateWise", component: ItemSalePurchaseDateWise },
  { path: "/SaleReturnReport", component: SaleReturnReport },
  { path: "/MonthlySaleReport", component: MonthlySaleReport },
  { path: "/SaleAgentReport", component: SaleAgentTrendReport },
  { path: "/SaleEditReport", component: SaleEditReport },
  { path: "/InvMismatchReport", component: InventoryMismatchReport },
  { path: "/ItemCountDailyReport", component: ItemCountDailySheetReport },
  { path: "/SaleSaleDetailMismatchReport", component: SaleSaleDetailMismatchReport },
  { path: "/PurchaseEditReport", component: PurchaseEditReport },

  // CART
  { path: "/myCart", component: MyCart },
  { path: "/cartDetails", component: CartDetails },

  // EXPENSE
  { path: "/AddExpense", component: AddExpense },
  { path: "/AddCashFlow", component: CashFlow },
  { path: "/AR", component: CashFlowAR },
  { path: "/AP", component: CashFlowAP }
];
