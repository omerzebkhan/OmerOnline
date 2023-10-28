import axios from "axios";

export default axios.create({
  //local system test
  //baseURL: "http://localhost:8080/online/",
  //Heruko local test 
  //baseURL: "http://localhost:5000/online/",
  //Heruko remote N&M Traders
  //baseURL :"https://damp-brushlands-21463.herokuapp.com/online/",
  //Heruko remote omerwholesale 
  baseURL :"https://omerwholesale-mv-1d53fab06d42.herokuapp.com/online/",
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  }
});