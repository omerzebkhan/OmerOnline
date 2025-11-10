import React, { useState,useLayoutEffect } from 'react';
import {useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'
import userService from "../../services/user.service";
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';



const AddRole = () => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [access,setAccess] = useState(false);

    const currentUser = useSelector((state) => state.user.user.user);

    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
         setAccess(checkAccess("ADD ROLE",currentUser.rights));
        //console.log(`access value = ${access}`)
     }
         , []);


    const handleSubmit = async event => {
        event.preventDefault();
        //uploading image on firestore image name should be brand name
        //console.log(role);
        setLoading(true); 
        //setMessage("Processing ......");      
        // add user
        saveRole();
            
    }

    const saveRole = () => {

        var data = {
                            name   : name,
        };
        console.log(`data to be sent ${data}`);
        userService.createRole(data)
            .then(response => {
               
                setMessage(`Role successfully Added Role id = ${response.data.id}`);
                console.log(response.data);
                setLoading(false);
            setName("");
            
            })
            .catch(e => { setMessage(`catch of Add Role ${e} error from server  ${e.message}`)
            console.log(`error ::::${e} message::::  ${e.message}`);
})
    }
    

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "Name") {
            setName(event.target.value);
        }
        
    }




    return (
        <div>
        {access ?
        <div className="submit-form">
            
            <div className="inputFormHeader"><h1>Add New Role</h1></div>
            <div className="inputForm">
            {loading ? <div className="alert alert-warning" role="alert">Processing....</div> : ''}
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
                        onChange={handleChange} />
                    </div>    
                </div>
           
               
               
               

                
                <div>
                    <button className="btn btn-primary" type="submit">Add</button>

                </div>
            </form>
            </div>
        </div>
         :
         "Access denied for the screen"}
         </div>
  );
}


export default AddRole;