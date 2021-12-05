import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'
import userService from "../../services/user.service";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

import { fetchRoleStartAsync } from '../../redux/role/roles.actions';



const AddUser = ({ fetchRoleStartAsync, roleData, selectedUser }) => {
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

    const [cRole, setcRole] = useState([]);
    const [roleInput, setRoleInput] = useState("");
    const [activeOptionRole, setActiveOptionRole] = useState("");
    const [showOptionsRole, setShowOptionsRole] = useState(false);
    const [filteredOptionsRole, setFilteredOptionsRole] = useState([]);

    const [content, setContent] = useState("");
    const [access, setAccess] = useState(false);

    const currentUser = useSelector((state) => state.user.user.user);

    useLayoutEffect(() => {
        checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("ADD USER", currentUser.rights));
        //console.log(`access value = ${access}`)
    }
        , []);

    useEffect(() => {
        fetchRoleStartAsync();

    }, [fetchRoleStartAsync])

    useEffect(() => {
        if (selectedUser) {
            setName(selectedUser.name)
            setMobile(selectedUser.mobile)
            setAddress(selectedUser.address)
            setPh(selectedUser.ph)
            setEmail(selectedUser.email)
            setUserName(selectedUser.username)
            setPassword(selectedUser.password)
            setDescription(selectedUser.description)
            setComments(selectedUser.comments)
        }

    }, [selectedUser])

    useEffect(() => {
        if (selectedUser) {
            if (roleData && selectedUser.roles) {
                const selectedRole = roleData.filter(
                    (option) => option.name === selectedUser.roles
                );
                if (selectedRole) {
                    //console.log(selectedRole[0].name)
                    setRoleInput(selectedRole[0].name);
                    setcRole(selectedRole)
                }
            }
            else {
                setRoleInput(`Select Role`)
                setcRole([]);
            }

        }
        
   // }, [roleData,selectedUser.roles])
}, [roleData,selectedUser])




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
        userService.create(data)
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

                console.log(`creating role for the user 
                            user id = ${response.data.id}
                            role id = ${cRole[0].id}`)
                const data = {
                    roleId: cRole[0].id,
                    userId: response.data.id
                }
                userService.createUserRole(data)
                    .then(res => console.log("Role successfully added ....."))
                    .catch(error => {
                        //console.log(`${e}   error message =   ${e.message} error response =   ${e.response.message}`);


                        if (error.response) {
                            const obj = JSON.parse(error.response.request.response);
                            setIsValid(false);
                            setMessage(obj.message)
                            console.log(obj.message);
                            if (obj.message === "Unauthorized!") {
                                setContent(obj.message)
                            }
                        } else if (error.request) {
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

                //////////////////////////////////////////////////////////////////////

                setMessage(`User successfully Added User id = ${response.data.id}`);
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
                    console.log(obj.message);
                    if (obj.message === "Unauthorized!") {
                        setContent(obj.message)
                    }
                } else if (error.request) {
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
    const updateUser = () => {

        var data = {
            name: name,
            address: address,
            mobile: mobile,
            password: password,
            ph: ph,
            description: description,
            comments: comments
        };
        console.log(`data to be sent ${selectedUser.id}`);
        userService.update(selectedUser.id,data)
            .then(response => {

                /////////////////////////////// Associate role with the id//////////////
                console.log(`user id = ${selectedUser.id}
                            role id = ${cRole[0].id}`)
                const data = {
                    roleId: cRole[0].id
                }
                userService.updateUserRole  (selectedUser.id,data)
                    .then(res => {
                        console.log("Role successfully added .....")
                        setMessage("Role successfully added .....")
                    })
                    .catch(error => {
                        //console.log(`${e}   error message =   ${e.message} error response =   ${e.response.message}`);


                        if (error.response) {
                            const obj = JSON.parse(error.response.request.response);
                            setIsValid(false);
                            setMessage(obj.message)
                            console.log(obj.message);
                            if (obj.message === "Unauthorized!") {
                                setContent(obj.message)
                            }
                        } else if (error.request) {
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

                //////////////////////////////////////////////////////////////////////

               
              
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
                    console.log(obj.message);
                    if (obj.message === "Unauthorized!") {
                        setContent(obj.message)
                    }
                } else if (error.request) {
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
        else if (event.target.id === "roleSearch") {
            //console.log(`roleInput = ${roleInput}`)
            //   console.log(`roledata = ${roleData[6].name}  search value = ${event.target.value}`)
            setRoleInput(event.target.value);
            setFilteredOptionsRole(roleData.filter(
                //may be null value is comming from the db
                //console.log()
                (option) => option.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
                // (option) => console.log(option.name) 
            ));
            setActiveOptionRole(0);
            setShowOptionsRole(true);
            //setCustomerInput(customerInput);
            setRoleInput(event.target.value);
           // console.log(`role event :::::${event.target.value}`)
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

    //////////////////////////////////////////////////////////////////////
    /////////////////////////// Drop down logic for Role 
    const onKeyDownRole = (e) => {
        //console.log("On change is fired")
        // const { activeOption, filteredOptions } = this.props;
        //  console.log(`key down ${e.keyCode}`)
        if (e.keyCode === 13) {
            setActiveOptionRole(0);
            setShowOptionsRole(false);
            setRoleInput(filteredOptionsRole[activeOptionRole]);
        } else if (e.keyCode === 38) {
            if (activeOptionRole === 0) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionRole(activeOptionRole - 1)
        } else if (e.keyCode === 40) {
            if (activeOptionRole - 1 === filteredOptionsRole.length) {
                //setcCustomer([]);
                return;
            }
            setActiveOptionRole(activeOptionRole + 1)
        }

    };
    const onClickRole = (e) => {
        setActiveOptionRole(0);
        setFilteredOptionsRole([]);
        setShowOptionsRole(false);

        //console.log(`selecte role id = ${e.currentTarget.dataset.id}`);
        //console.log(`user data${roleData[0].id}`);
        const selectedRole = roleData.filter(
            (option) => option.id == e.currentTarget.dataset.id
        );
        //console.log(`selected Role = ${selectedRole}`)
        // const selectedCustomer = userData.filter(function (el) {
        //     console.log(el.id)
        //     return el.id == e.currentTarget.dataset.id ;
        //   });
        // console.log(`selected customer ${selectedCustomer.name}`);
        setRoleInput(selectedRole[0].name);
        setcRole(selectedRole);

        // console.log(cItem[0].name)
    };
    let optionListRole;
    if (showOptionsRole && roleInput) {
        if (filteredOptionsRole.length) {
            optionListRole = (
                <ul className="options">
                    {filteredOptionsRole.map((optionName, index) => {
                        let className;
                        if (index === activeOptionRole) {
                            className = 'option-active';
                        }
                        return (
                            <li key={optionName.id} className={className} data-id={optionName.id} onClick={onClickRole}>
                                <table border='1' id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th className="th-sm">Name</th>
                                            <th>Role Namee</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{optionName.name}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            optionListRole = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }





    return (
        <div>
            {content !== "Unauthorized!" ?
                <div>
                    {access ?
                        <div className="submit-form container">

                            <div className="inputFormHeader"><h1>{selectedUser ? "Update User" : "Add New User"}</h1></div>
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

                                        <label className="col-sm-2 col-form-label" htmlFor="Item">Role Name</label>
                                        <div className="col-sm-4">
                                            <input
                                                type="text"
                                                name="roleSearch"
                                                id="roleSearch"
                                                placeholder="Select Role"
                                                value={roleInput}
                                                onChange={handleChange}
                                                onKeyDown={onKeyDownRole}
                                            />
                                            {optionListRole}
                                        </div>

                                        <label className="col-sm-2 col-form-label" htmlFor="Item">Role Id</label>

                                        <div className="col-sm-2">
                                            <input
                                                type="text"
                                                name="Role"
                                                id="Role"
                                                placeholder="Select Role"
                                                value={cRole[0] ?
                                                    cRole[0].id
                                                    :
                                                    ""
                                                }
                                                disabled />
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
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Description" >Description</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                name="Description"
                                                id="Description"
                                                placeholder="Description"
                                                value={description}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Comments" >Comments</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                name="Comments"
                                                id="Comments"
                                                placeholder="Comments"
                                                value={comments}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    {selectedUser ?
                                        <div>
                                            <button
                                                   type="button"
                                                   className="btn btn-primary"
                                                   onClick={updateUser}
                                            >
                                                Update
             </button>
                                        </div>
                                        :
                                        <div>
                                            <button className="btn btn-primary" type="submit">Add</button>

                                        </div>

                                    }

                                </form>
                            </div>
                        </div>
                        :
                        "Access denied for the screen"}
                </div>
                :
                content}
        </div>
    );
}

const mapStateToProps = state => ({
    roleData: state.role.roles
})

const mapDispatchToProps = dispatch => ({
    fetchRoleStartAsync: () => dispatch(fetchRoleStartAsync())

});

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);