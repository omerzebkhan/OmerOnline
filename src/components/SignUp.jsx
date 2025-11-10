import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'
import userService from "../services/user.service";


const SignUp = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [ph, setPh] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRePassword] = useState("");
    const [description, setDescription] = useState("");
    const [comments, setComments] = useState("");
    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isValid, setIsValid] = useState("true");
    const [error, setError] = useState({});

    


    const handleSubmit = async event => {
        event.preventDefault();
        //uploading image on firestore image name should be brand name
        //console.log(role);
        if (validate(event)) {
            //setLoading(true); 
            setMessage("Processing ......");
            // add user
            saveUser();

        }
        else {
            console.log(`error in submit 
        ${error.name} 
        ${error.username}
        `)
        }

    }

    const saveUser = () => {

        var data = {
            name: name,
            address: address,
            mobile: mobile,
            email: email,
            username: username,
            password: password,
            ph: ph,
            description: description,
            totalamount: 0.0,
            Outstanding: 0.0,
            comments: comments
        };
        console.log(`data to be sent ${data}`);
        userService.createOnlineCust(data)
            .then(response => {
                // this.setState({
                //   id: response.data.id,
                //   name: response.data.name,
                //   description: response.data.description,
                //   url: response.data.url
                // });
                // console.log(response.status);
                // console.log(response.data.id);

                /////////////////////////////// Associate role with the id//////////////

                
                //Role id of online customer = 5
                const data = {
                    roleId:5,
                    userId: response.data.id
                }
                userService.createUserRoleOnline(data)
                    .then(res => console.log("Role successfully added ....."))
                    .catch(error => {
                        //console.log(`${e}   error message =   ${e.message} error response =   ${e.response.message}`);


                        if (error.response) {
                            const obj = JSON.parse(error.response.request.response);
                            setIsValid(false);
                            setMessage(obj.message)
                            console.log(obj.message);}
                       if (error.request) {
                            // The request was made but no response was received
                            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                            // http.ClientRequest in node.js
                            console.log(`error at user role creation ${error.request}`);
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }
                        console.log(error.config);

                    });

                //////////////////////////////////////////////////////////////////////

                setMessage(`User successfully Added User id = ${response.data.id} Kindly check OPT in Your email and verify the OPT Code.`);
                console.log(response.data);
                //setLoading(false);
                setName("");
                setMobile("");
                setAddress("");
                setPh("");
                setRole("");
                setEmail("");
                setDescription("");
                setComments("");
            })
            .catch(error => {
                //console.log(`${e}   error message =   ${e.message} error response =   ${e.response.message}`);


                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                    // console.log(error.response.request.response);
                    const obj = JSON.parse(error.response.request.response);
                    setIsValid(false);
                    setError({ "Email": obj.message });
                    setMessage(obj.message)
                    console.log(obj.message);}
                   if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);

            });
    }
   

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "Name") {
            setName(event.target.value);
        }
        else if (event.target.id === "Mobile") {
            setMobile(event.target.value);
        }
        else if (event.target.id === "Address") {
            setAddress(event.target.value);
        }
        else if (event.target.id === "Ph") {
            setPh(event.target.value);
        }
        else if (event.target.id === "Role") {
            setRole(event.target.value);
        }
        else if (event.target.id === "Email") {
            setEmail(event.target.value);
        }
        else if (event.target.id === "UserName") {
            setUserName(event.target.value);
        }
        else if (event.target.id === "Password") {
            setPassword(event.target.value);
        }
        else if (event.target.id === "RePassword") {
            setRePassword(event.target.value);
        }
        else if (event.target.id === "Description") {
            setDescription(event.target.value);
        }
        else if (event.target.id === "Comments") {
            setComments(event.target.value);
        }
    }

    const validate = event => {
        // console.log(`Validation is called.... ${event.target}`)
        setIsValid(true);
        setError({});
        if (!name) {

            setIsValid(false);
            setError({ "name": "Enter your Name" });
            console.log(`seting error at name = ${error}`)
        }
        if (!username) {

            setIsValid(false);
            setError({ "username": "Enter your User Name" });

        }

        return isValid;

    }

    
    return (
        <div>
            
                <div>
                
                        <div className="submit-form container">

                            <div className="inputFormHeader"><h1>Register User</h1></div>
                            <div className="inputForm">

                                {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}
                                {errorMsg ? <div className="alert alert-warning" role="alert">{errorMsg}</div> : ""}
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Name">Name</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                name="Name"
                                                id="Name"
                                                placeholder="Name"
                                                value={name}
                                                onChange={handleChange}
                                            />
                                            <div className="text-danger">{error.name}</div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Mobile">Mobile</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                name="Mobile"
                                                id="Mobile"
                                                placeholder="Mobile"
                                                value={mobile}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Ph">Ph</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                name="Ph"
                                                id="Ph"
                                                placeholder="Ph"
                                                value={ph}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Address">Address</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                name="Address"
                                                id="Address"
                                                placeholder="Address"
                                                value={address}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                  

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
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="UserName" >User Name</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                name="UserName"
                                                id="UserName"
                                                placeholder="UserName"
                                                value={username}
                                                onChange={handleChange} />
                                            <div className="text-danger">{error.username}</div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Password" >Password</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="password"
                                                name="Password"
                                                id="Password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="RePassword" >Confirm Password</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="password"
                                                name="RePassword"
                                                id="RePassword"
                                                placeholder="Confirm Password"
                                                value={repassword}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                        <div>
                                            <button className="btn btn-primary" type="submit">Add</button>

                                        </div>

                                </form>
                            </div>
                        </div>
                      
                </div>
                
        </div>
    );
}


export default SignUp;