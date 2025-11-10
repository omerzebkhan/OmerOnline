import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
//import {store,persistor} from '..//src/redux/store';
import {store,persistor} from '../src/redux/store';
import App from "./App";


ReactDOM.render(
  // <BrowserRouter>
  //   {/* <App /> */}
  // </BrowserRouter>,
  <Provider store={store}>
<BrowserRouter>
    <PersistGate  persistor={persistor}>
    <App />
    </PersistGate>
  </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

