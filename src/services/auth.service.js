import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

//const API_URL = "http://localhost:8080/api/auth/";   //local server
//const API_URL = "https://damp-brushlands-21463.herokuapp.com/api/auth/";  // remote heroku N&M
//const API_URL = "https://omerwholesale-mv-1d53fab06d42.herokuapp.com/api/auth/";  // remote heroku omerwholesale

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const auth = {
  register,
  login,
  logout
}

export default auth;