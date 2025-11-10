import http from "../http-common";
import axios from "axios";
import authHeader from "./auth-header";


const API_URL1 =import.meta.env.VITE_API_URL1
// local
//const API_URL = "http://localhost:8080/api/test/";

//Heroku
//const API_URL = "http://localhost:5000/api/test/";

//Heruko remote N&M trader
//const API_URL ="https://damp-brushlands-21463.herokuapp.com/api/test/"

//Heruko remote omerwholesale
//const API_URL ="https://omerwholesale-mv-1d53fab06d42.herokuapp.com/api/test/"

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

  //Create Online Customer
  createOnlineCust(data) {
    // console.log(data);
     return http.post("/createOnlineCustomer/",data);
   }

  //Verify Online Customer
  verifyOnlineCust(data) {
    // console.log(data);
     return http.post("/verifyOnlineCust/",data);
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

  getRoleAccess(id) {
    return http.get(`/roleAccess/${id}`);
  }

  //update Access to the role
updateRoleAccess(id, data) {
  //console.log(`update triggred from react .....`)
  return http.put(`/updateRoleAccess/${id}`, data);
}



  //add the line link to the user and role
  createUserRole(data){
    return http.post("/userRole/",data,{headers: authHeader() });
  }

   //add the line link to the user and role
   createUserRoleOnline(data){
    return http.post("/userRoleOnline/",data);
  }

//update link to the user and role
updateUserRole(id, data) {
  //console.log(`update triggred from react .....`)
  return http.put(`/userRole/${id}`, data);
}
  





  getPublicContent = () => {
    return axios.get(API_URL1 + "all");
  };
  
  getUserBoard = () => {
    return axios.get(API_URL1 + "user", { headers: authHeader() });
  };
  
  getModeratorBoard = () => {
    return axios.get(API_URL1 + "aPa", { headers: authHeader() });
  };
  
  getAdminBoard = () => {
    return axios.get(API_URL1 + "admin", { headers: authHeader() });
  };
  
  


  
}

export default new userDataService();