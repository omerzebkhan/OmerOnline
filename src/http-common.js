import axios from "axios";


export default axios.create({
  //local system test
  //baseURL: "http://localhost:8080/online/",
  //Heruko local test 
  //baseURL: "http://localhost:5000/online/",
  //Heruko remote test
 baseURL :"https://damp-brushlands-21463.herokuapp.com/online/",

  headers: {
    "Content-type": "application/json"
  }
});