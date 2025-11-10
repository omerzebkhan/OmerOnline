import React, { useEffect } from "react";
import LandingPage from "./landingpage/landingpage.component";
import 'bootstrap/dist/css/bootstrap.min.css'

import UserService from "../services/user.service";

const Home = () => {
  //const [content, setContent] = useState("");
const temp="";
  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        //setContent(response.data);
        console.log(response.data)
      },
      (error) => {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        // const _content =
        //   (error.response && error.response.data) ||
        //   error.message ||
        //   error.toString();

        // setContent(_content);
      }
    );
  }, []);

  return (
    <div >
      
        <LandingPage />
     
    </div>
  );
};

export default Home;