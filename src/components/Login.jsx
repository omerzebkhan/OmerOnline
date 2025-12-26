import React, { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import { login } from "../redux/user/user.action";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // const { isLoggedIn, currentUser } = useSelector(
  //   (state) => state.user.user || { isLoggedIn: false, currentUser: null }
  // );


  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const currentUser = useSelector(state => state.user.currentUser);
  const message = useSelector((state) => state.user.message);

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    setLoading(true);

    dispatch(login(data.username, data.password))
      .then(() => {
        // Debug logs
        console.log("[Login] Redux state after login:", { isLoggedIn, currentUser });

        // Check if there is a post-login redirect (online user)
        const redirectTo = localStorage.getItem("postLoginRedirect");
        if (redirectTo) {
          localStorage.removeItem("postLoginRedirect");
          navigate(redirectTo, { replace: true });
          return;
        }

        // Normal user login
        navigate("/profile", { replace: true });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // If already logged in, redirect to profile
  if (isLoggedIn) {
    return navigate("/profile", { replace: true });
  }

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_1x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm"></span>}
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="alert alert-danger" role="alert">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
