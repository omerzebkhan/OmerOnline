import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
//for local storage
import storage from 'redux-persist/lib/storage';
//for session storage check the path on the doc.

import brandReducer from './brands/brands.reducer';
import categoryReducer from './cateogry/cateogry.reducer';
import subCategoryReducer from './sub-category/subCategory.reducer';
import itemReducer from './item/item.reducer';
import stockReducer from './stock/stock.reducer';
import siteManagementReducer from './siteManagement/siteManagement.reducer';
import purchaseReducer from './purchase/purchase.reducer';
import saleReducer from './Sale/sale.reducer';
import userReducer from './user/user.reducer';
import roleReducer from './role/roles.reducer';
import expenseReducer from './expense/expense.reducer'
import cartReducer from './cart/cart.reducer';

const persistConfig = {
    key:'root',
    storage,
    whitelist:['cart']
}

const rootReducer =combineReducers({
    brand:brandReducer,
    category:categoryReducer,
    subCategory:subCategoryReducer,
    item:itemReducer,
    stock:stockReducer,
    siteManagement:siteManagementReducer,
    purchase:purchaseReducer,
    sale:saleReducer,
    user:userReducer,
    role:roleReducer,
    expense:expenseReducer,
    cart:cartReducer
});

export default persistReducer(persistConfig,rootReducer);
