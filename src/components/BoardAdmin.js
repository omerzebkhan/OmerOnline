import React, { useState, useEffect } from "react";
import "../App.css";

import UserService from "../services/user.service";


import Navigation from '../components/Navigation/navigation';




const BoardAdmin = () => {
  const [content, setContent] = useState("");

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

  return (
    <div className="container">
    
        {content.includes("Admin") ? 
        <div >
            <Navigation />
        </div>
        :
        content}
     
    </div>
  );
};

export default BoardAdmin;