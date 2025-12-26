// App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import LandingPage from "./components/landingpage/landingpage.component";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import * as Pages from "./routes/PageMap";

import { clearMessage, logout } from "./redux/user/user.action";
import { fetchItemByInputAsync } from "./redux/item/item.action";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = useSelector((state) => state.user?.user || null);

  // 🔹 Clear messages on route change
  useEffect(() => {
    dispatch(clearMessage());
  }, [location.pathname, dispatch]);

  // 🔹 Global fetch items on category change or route change
  // useEffect(() => {
  //   const refreshCat = localStorage.getItem("localCategory");
  //   if (refreshCat) {
  //     console.log("Global fetch on route change, category:", refreshCat);
  //     dispatch(fetchItemByInputAsync(refreshCat));
  //   }
  // }, [location.pathname, dispatch]);

  // 🔹 Roles derived directly from Redux state
  const roles = currentUser?.roles || [];
  const roleFlags = {
    isAdmin: roles.includes("ROLE_ADMIN"),
    //isUser: roles.includes("ROLE_USER"),
    isUser: roles.includes("ROLE_ONLINECUSTOMER"),
    isPurchase: roles.includes("ROLE_PURCHASEAGENT"),
    isSale: roles.includes("ROLE_SALEAGENT"),
  };

  return (
    <div className="appBackground">
      {/* NAVBAR */}
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to="/" className="navbar-brand">
          Online Store {import.meta.env.VITE_COMPANYNAME}
        </Link>

        {/* LEFT MENU: Role-based links 
        All should go to admin page 
        there will be two nav bar based on the role 
        1-If role = ROLE_ONLINECUSTOMER 
        2-For all other ROLE based on the DB value for each screen*/}
        {currentUser && (
          <div className="navbar-nav mr-auto">
            {roleFlags.isPurchase && <Link to="/aPa" className="nav-link">Purchase Agent</Link>}
            {roleFlags.isAdmin && <Link to="/admin" className="nav-link">Admin Board</Link>}
            {roleFlags.isSale && <Link to="/saleAgent" className="nav-link">Sale Agent</Link>}
            {roleFlags.isUser && <Link to="/admin" className="nav-link">User</Link>}
          </div>
        )}

        {/* RIGHT MENU: Login / Profile / Logout */}
        <div className="navbar-nav ms-auto">
          {!currentUser ? (
            <Link
              to="/login"
              className="btn btn-outline-light px-3 py-1"
              style={{ borderRadius: "6px", marginRight: "10px" }}
            >
              Login
            </Link>
          ) : (
            <>
              <Link to="/profile" className="nav-link">{currentUser.username}</Link>
              <button
                className="nav-link btn btn-outline-light px-3 py-1"
                style={{ borderRadius: "6px", marginLeft: "10px" }}
                onClick={() => {
                  dispatch(logout());
                  navigate("/login", { replace: true });
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />

        {/* Dynamic Routes */}
        {Pages.allRoutes?.map((r, idx) => {
          //console.log("Mapping route:", r.path);
          const Component = r.component;
          return <Route key={idx} path={r.path} element={<Component />} />;
        })}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
