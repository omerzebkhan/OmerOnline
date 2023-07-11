import http from "../http-common";
import axios from "axios";
import authHeader from "./auth-header";

// local
//const API_URL = "http://localhost:8080/api/test/";

//Heroku
//const API_URL = "http://localhost:5000/api/test/";

//Heruko remote
const API_URL ="https://damp-brushlands-21463.herokuapp.com/api/test/"

class userDataService {
  getAll(params) {
    return http.get("/user/",{ params });
  }

  get(id) {
    return http.get(`/user/${id}`);
  }

  create(data) {
   // console.log(data);
    return http.post("/user/",data,{headers: authHeader() });
  }

  

  update(id, data) {
    //console.log(`update triggred from react .....`)
    return http.put(`/user/${id}`, data);
  }

////////////////////////////
///////////ROLE/////////////
////////////////////////////
createRole(data) {
  //  console.log(data);
    return http.post("/role/",data,{headers: authHeader() });
  }

  getAllRole() {
    return http.get("/role/",{headers: authHeader() });
  }

  //add the line link to the user and role
  createUserRole(data){
    return http.post("/userRole/",data,{headers: authHeader() });
  }

//update link to the user and role
updateUserRole(id, data) {
  //console.log(`update triggred from react .....`)
  return http.put(`/userRole/${id}`, data);
}
  





  getPublicContent = () => {
    return axios.get(API_URL + "all");
  };
  
  getUserBoard = () => {
    return axios.get(API_URL + "user", { headers: authHeader() });
  };
  
  getModeratorBoard = () => {
    return axios.get(API_URL + "aPa", { headers: authHeader() });
  };
  
  getAdminBoard = () => {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  };
  
  


  
}

export default new userDataService();