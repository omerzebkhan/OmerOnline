import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'
import userService from "../services/user.service";


const VerifyUser = () => {
    const [OTP, setOTP] = useState("");
    
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isValid, setIsValid] = useState("true");
    const [error, setError] = useState({});
    const [message, setMessage] = useState("");

    const handleSubmit = async event => {
        event.preventDefault();
        //uploading image on firestore image name should be brand name
        //console.log(role);
        if (validate(event)) {
            //setLoading(true); 
            setMessage("Processing ......");
            // verify user
            verifyUser();

        }
        else {
            console.log(`error in submit 
        ${error.name} 
        ${error.username}
        `)
        }

    }

    const verifyUser = () => {

        var data = {          
            email: email,
            otp:OTP
        };
        console.log(`data to be sent ${data.email}  ** ${data.otp}`);
        userService.verifyOnlineCust(data)
            .then(response => {
                                
                setMessage(`${response.data.message}`);
                console.log(response.data);
                
                setEmail("");
                setOTP("");
            })
            .catch(error => {
                
                if (error.response) {


                    const obj = JSON.parse(error.response.request.response);
                    setIsValid(false);
                    //console.log(error.response.status);
                    if (error.response.status===418){
                        setMessage(obj.message)
                      //  console.log(error.response.status);
                    }
                    //setError({ "Email": obj.message });
                   
                }
               if (error.request) {
                    
                    console.log(error.request);
                } else {
                    
                    console.log('Error', error.message);
                }
                console.log(error.config);

            });
    }

    const validate = event => {
        console.log(`Validation is called.... ${event.target}`)
        setIsValid(true);
        setError({});
        if (!email) {
            setIsValid(false);
            setError({ "Email": "Enter your Email" });
            console.log(`seting error at Email = ${error}`)
        }
        if (!OTP) {
            setIsValid(false);
            setError({ "OTP": "Enter your OTP" });
        }
        return isValid;
    }

   

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "Email") {
            setEmail(event.target.value);
        }
        else if (event.target.id === "OTP") {
            setOTP(event.target.value);
        }
    }

    
    return (
        <div>
            
                <div>
                
                        <div className="submit-form container">

                            <div className="inputFormHeader"><h1>Verify OTP</h1></div>
                            <div className="inputForm">

                                {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}
                                {errorMsg ? <div className="alert alert-warning" role="alert">{errorMsg}</div> : ""}
                                <form onSubmit={handleSubmit}>
                                    
                                    
                                    

                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Email">Email</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                name="Email"
                                                id="Email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={handleChange} />
                                                <div className="text-danger">{error.Email}</div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="OTP" >OTP</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                name="OTP"
                                                id="OTP"
                                                placeholder="OTP"
                                                value={OTP}
                                                onChange={handleChange} />
                                            <div className="text-danger">{error.OTP}</div>
                                        </div>
                                    </div>
                                        <div>
                                            <button className="btn btn-primary" type="submit">Verify</button>

                                        </div>


                                </form>
                            </div>
                        </div>
                      
                </div>
                
        </div>
    );
}


export default VerifyUser;