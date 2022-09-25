import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useLocation } from "react-router-dom";
import {Button } from 'react-bootstrap'

import { useSelector } from 'react-redux';

// import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';



import "../../App.css";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';


//item detail for the customer view



const ItemDetail = () => {

    const location = useLocation();
    const selectedItem = location.state.id;
    console.log(selectedItem)

    // const authResult = new URLSearchParams(window.location.search); 
    // const id = authResult.get('id')
    // console.log(id.id)

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [brand, setBrand] = useState("");
    const [code, setCode] = useState("");
    // const [selCat, setSelCat] = useState("");
    // const [selSubCat, setSelSubCat] = useState("");
    // const [activeOption, setActiveOption] = useState(0);
    // const [filteredOptions, setFilteredOptions] = useState([]);
    // const [showOptions, setShowOptions] = useState(false);
    const [userInput, setUserInput] = useState('');
    // const [btnBrand, setBtnBrand] = useState("Show");

    const [message, setMessage] = useState("");


    // const [content, setContent] = useState("");
    // const [access, setAccess] = useState(false);

    // const currentUser = useSelector((state) => state.user.user.user);






    useEffect(() => {
        if (selectedItem) {
            setName(selectedItem.name);
            setCode(selectedItem.code)
            setDescription(selectedItem.description);
            setBrand(selectedItem.brands.name);
            ///Category Value
            setUserInput(selectedItem.categories.name);  // name
            //  setSelCat(selectedItem.categories.id);//id
            //SubCategory Values

            // setSelSubCat(selectedItem.subcategories.id) //id


        }

    }, [selectedItem])

    return (

        <div className="submit-form">

            <div>

                {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''}
                {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

                <div className="inputFormHeader"><h1>Product Details</h1></div>
                <div>
                    <div class="row">
                        <div class="col-sm-3">
                            <img src={process.env.REACT_APP_S3 === "True" ?
                                `${selectedItem.imageUrl}`
                                :
                                `${process.env.REACT_APP_MIDDLEWARE}/itemsImages/${selectedItem.imageUrl}`} alt="item" style={{ width: '100%', }} />
                        </div>
                        <div class="col-sm-9">

                            <div className="inputForm">

                                <form >
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Name">Name</label>
                                        <div className="col-sm-10">
                                            <label className="col-sm-2 col-form-label" htmlFor="itemName" >{name}</label>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Code">Code</label>
                                        <div className="col-sm-10">
                                            <label className="col-sm-2 col-form-label" htmlFor="itemCode" >{code}</label>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Description" >Description</label>
                                        <div className="col-sm-10">
                                            <label className="col-sm-2 col-form-label" htmlFor="itemDescription" >{description}</label>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Brand" >brand</label>
                                        <div className="col-sm-8">
                                            <label className="col-sm-2 col-form-label" htmlFor="Brand" >{brand}</label>
                                        </div>

                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label" htmlFor="Category" >Category</label>
                                        <div className="col-sm-10">
                                            <label className="col-sm-2 col-form-label" htmlFor="Brand" >{userInput}</label>
                                        </div>
                                    </div>




                                </form>
                                <Button onClick={()=> alert("function under development")} variant="primary" >Add to Cart</Button>

                                {/* <div>

        <i className="fa fa-sun-o" />
        <i className="fa fa-spinner fa-spin" />
        <i className="fa cofee"></i>
    </div> */}
                        
                        </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}



export default ItemDetail;