import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import {Accordion} from 'react-bootstrap';

import "../App.css";

import UserService from "../services/user.service";
import { logout } from "../redux/user/user.action";




import Navigation from '../components/Navigation/navigation';




const BoardAdmin = (props) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  const logOut = (c) => {
   console.log(`content = ${content}`)
    //<Redirect to="/login" />
    props.history.push({pathname:'/Login',state: { detail: c }});
    //localStorage.removeItem("user");
    //dispatch(logout());// getting error on it
//    props.history.push("/Login",state:"data");
   // window.location.reload();
  };

  return (
    <div className="container">
    
        {content.includes("Admin") ? 
        <div >
            <Navigation />
            
        </div>
        :
        // redirect to login page due to unauthrization
       //logOut(content)
        content ? 
        logOut(content) 
        : 
        ""
        }



     
    </div>
  );
};

export default BoardAdmin;