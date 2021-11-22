import React, { useState,useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'
import userService from "../../services/user.service";
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';



const UpdateAccess = ({currentUser}) => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [ph, setPh] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [comments, setComments] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [access,setAccess] = useState(false);

    //const currentUser = useSelector((state) => state.user.user.user);

    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
         setAccess(checkAccess("UPDATE ACCESS",currentUser.rights));
        //console.log(`access value = ${access}`)
     }
         , []);


    const handleSubmit = async event => {
        event.preventDefault();
        //uploading image on firestore image name should be brand name
        //console.log(role);
        setLoading(true); 
        setMessage("Processing ......");      
        // add user
        saveItem();
            
    }

    const saveItem = () => {

        var data = {
                            name   : name,
                            address: address,
                            mobile : mobile,
                            email  : email,
                            ph     : ph,
                            role   : role,
                            description: description,
                            totalamount :0.0,
                            Outstanding : 0.0,    
                            comments :comments   
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
              
                setMessage(`User successfully Added User id = ${response.data.id}`);
                console.log(response.data);
                setLoading(false);
            setName("");
            setMobile("");
            setAddress("");
            setPh("");
            setRole("");
            setEmail("");
            setDescription("");
            setComments("");
     
            })
            .catch(e => {
                console.log(e);
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
        else if (event.target.id === "Description") {
            setDescription(event.target.value);
        }
        else if (event.target.id === "Comments") {
            setComments(event.target.value);
        }
    }




    return (
        <div>
        {access ?
        <div className="submit-form">
            
            <div className="inputFormHeader"><h1>Add New User</h1></div>
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
                <label className="col-sm-2 col-form-label" htmlFor="Role">Role</label>
                <div className="col-sm-10">
                <select id = "Role" className="custom-select custom-select-sm mb-3"
                        onChange={handleChange}
                >
                <option defaultValue>Select Role</option>
                <option value="Supplier">Supplier</option>
                <option value="Customer">Customer</option>  
                <option value="SaleAgent">SaleAgent</option>                       
                </select>
                
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
const mapStateToProps = state => ({
    currentUser: state.user.user.user
})

export default connect(mapStateToProps)(UpdateAccess);
