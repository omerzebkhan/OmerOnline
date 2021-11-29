import React, { useState, useEffect,useLayoutEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { connect,useSelector } from 'react-redux';

import itemService from "../../services/item.services";
import UploadService from "../../services/FileUploadService";
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';


import { fetchCategoryStartAsync } from '../../redux/cateogry/category.actions';
import { fetchSubCategoryStartAsync } from '../../redux/sub-category/subCategory.actions';
import BrandSearch from "../brand/search-brand.component";
import "../../App.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';




const AddItem = ({
    fetchCategoryStartAsync, CategoryData,
    fetchSubCategoryStartAsync, SubCategoryData,
    currentBrand,selectedItem }) => {

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [brand,setBrand] = useState("");
    const [code, setCode] = useState("");
    const [selCat, setSelCat] = useState("");
    const [selSubCat, setSelSubCat] = useState("");
    const [activeOption, setActiveOption] = useState(0);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [btnBrand, setBtnBrand] = useState("Show");

    const [message, setMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);

    const [content, setContent] = useState("");
    const [access,setAccess] = useState(false);

    const currentUser = useSelector((state) => state.user.user.user);

    useLayoutEffect(() => {
        checkAdmin().then((r) => { setContent(r);});
        setAccess(checkAccess("ADD ITEM",currentUser.rights));
         }
    , []);


    useEffect(() => {
        fetchCategoryStartAsync();

    }, [fetchCategoryStartAsync])

    useEffect(() => {
        setBtnBrand("Show")

    }, [currentBrand])

    useEffect(() => {
        if (selectedItem) {
            setName(selectedItem.name);
            setCode(selectedItem.code)
            setDescription(selectedItem.description);
            setBrand(selectedItem.brands.name); 
            ///Category Value
            setUserInput(selectedItem.categories.name);  // name
            setSelCat(selectedItem.categories.id);//id
            //SubCategory Values

            setSelSubCat(selectedItem.subcategories.id) //id

           
        }

    }, [selectedItem])

    useEffect(()=>{
        if(currentBrand){
            setBrand(currentBrand)
        }
    },[currentBrand])

    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
    };


    const btnBrandHandler = (event) => {
        event.preventDefault();
        console.log("btnBrandHandler is clicked");

        if (btnBrand === "Show") {
            setBtnBrand("Hide")
        } else {
            setBtnBrand("Show")
        }
    }

    const selectHandler = event => {
        setSelSubCat(event.target.value);
    }

    const upload = (id) => {
        let currentFile = selectedFiles[0];
        //console.log(`image itemid = ${id}`)
        setProgress(0);
        setCurrentFile(currentFile);
        //console.log(currentFile);
        const lastDot = currentFile.name.lastIndexOf('.');
        const ext = currentFile.name.substring(lastDot + 1);
        var fn = `item${id}.${ext}`;
        // console.log(`file name should be ${fn}`);
        // file.originalname = `${req.body.filename}.${ext}`;

        UploadService.upload(currentFile, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }, fn, '\\App\\uploads\\itemsImages\\')
            .then((response) => {
                if (process.env.REACT_APP_S3 ==="True"){
                    setMessage(response.data.message);
                    //console.log(response)
                    fn = `${response.data.data.Location}`
                   // console.log(fn)
                    }
                    else
                    {
                        setMessage(response.data.message);
                      //  console.log(response.data.message)
                    }
              
                var data = {
                    imageUrl: fn
                };
                // console.log(`sending to update item data
                // data = ${data.brandId}`)
                 itemService.update(id, data);

            })
            //   .then((files) => {
            //     setFileInfos(files.data);
            //   })
            .catch((error) => {
                console.log(`error message=${error.response.request.response}`);
                setProgress(0);
                setMessage(error.response.request.response.message);
                //setMessage(response.data.message);
               // setCurrentFile(undefined);
            });

        setSelectedFiles(undefined);
    };

    const saveItem = () => {
        console.log(currentBrand);
        var data = {

            name: name,
            code: code,
            description: description,
            brandId: currentBrand.id,
            categoryId: selCat,
            subCategoryId: selSubCat,
            quantity: 0,
            online: 0,
            showroom: 0,
            warehouse: 0,
            onlineprice: 0,
            onlinediscount: 0,
            showroomprice: 0,
            averageprice: 0
        };

        itemService.create(data)
            .then(response => {
                // this.setState({
                //   id: response.data.id,
                //   name: response.data.name,
                //   description: response.data.description,
                //   url: response.data.url
                // });
                // console.log(response.status);
                // console.log(response.data.id);
                setMessage(`Item successfully Added Item id = ${response.data.id}`);
                // console.log(response.data);

                // upload image
                upload(response.data.id);

                // update the 

            })
            .catch(e => {
                console.log(e);
            });
    }

    const updateItem = () => {
        var data = {
            name: name,
            code: code,
            description: description,
            brandId: brand.id,
            categoryId: selCat,
            subCategoryId: selSubCat,
        };

        itemService.update(data)
            .then(response => {
                
                setMessage(`Item successfully Updated`);
                // console.log(response.data);

                // upload image
                upload(selectedItem.id);

                // update the 

            })
            .catch(e => {
                console.log(e);
            });
    }


    const handleSubmit = async event => {
        console.log("handle Submit executed");
        event.preventDefault();
        saveItem();


    }

    const onKeyDown = (e) => {
        //console.log("On change is fired")
        // const { activeOption, filteredOptions } = this.props;
        if (e.keyCode === 13) {
            setActiveOption(0);
            setShowOptions(false);
            setUserInput(filteredOptions[activeOption]);
        } else if (e.keyCode === 38) {
            if (activeOption === 0) {
                return;
            }
            setActiveOption(activeOption - 1)
        } else if (e.keyCode === 40) {
            if (activeOption - 1 === filteredOptions.length) {
                return;
            }
            setActiveOption(activeOption + 1)
        }
    };
    const onClick = (e) => {
        setActiveOption(0);
        setFilteredOptions([]);
        setShowOptions(false);
        setUserInput(e.currentTarget.innerText);
        //console.log(e.target);
        //console.log(e.currentTarget.dataset.id);
        setSelCat(e.currentTarget.dataset.id);
        //call redux function to get the sub category of the selected id
        fetchSubCategoryStartAsync(e.currentTarget.dataset.id);

    };

    const handleChange = event => {
        console.log("handle change is fired")
        //console.log(event);
        if (event.target.id === "file") {
            //alert("file change event fired")
            console.log(event.target.files[0]);
            // setFile(event.target.files[0]);

        }
        else if (event.target.id === "Name") {
            setName(event.target.value);
            // setFileName(event.target.value);
        }
        else if (event.target.id === "Code") {
            setCode(event.target.value);
        }
        else if (event.target.id === "Description") {
            setDescription(event.target.value);
        }
        else if (event.target.id === "Category") {
            const options = CategoryData;
            const userInput = event.currentTarget.value;
            const filteredOptions = options.filter(
                (option) => option.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
            );
            setActiveOption(0);
            setFilteredOptions(filteredOptions);
            setShowOptions(true);
            setUserInput(userInput);

        }
    }
    let optionListCategory;

    if (showOptions && userInput) {
        // console.log(filteredOptions);
        // console.log(filteredOptions.length)
        if (filteredOptions.length) {
            optionListCategory = (
                <ul className="options">
                    {filteredOptions.map((optionName, index) => {
                        let className;
                        if (index === activeOption) {
                            className = 'option-active';
                        }
                        return (
                            <li key={index} className={className} data-id={optionName.id} onClick={onClick}>
                                {optionName.name}
                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            optionListCategory = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }




    return (
        <div className="submit-form container">
            {access ?
                <div>

                    {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''}
                    {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

                    <div className="inputFormHeader"><h1>{selectedItem ? "Update Item" : "Add New Item"}</h1></div>
                    
                    <div className="inputForm">
                        <div>{btnBrand === 'Hide' ?
                            <BrandSearch masterComp="AddItem" /> : ""
                        }
                        </div>
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
                                <label className="col-sm-2 col-form-label" htmlFor="Name">Code</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="Code"
                                        id="Code"
                                        placeholder="Bar code"
                                        value={code}
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
                                <label className="col-sm-2 col-form-label" htmlFor="Brand" >brand</label>
                                <div className="col-sm-8">
                                    <input
                                        type="text"
                                        name="Brand"
                                        id="Brand"
                                        placeholder="Brand"
                                        value={brand.name}
                                        disabled />
                                </div>
                                <div className="col-sm-2">
                                    <button className="btn btn-primary searchButton" type="button" onClick={btnBrandHandler}>{btnBrand}</button>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label" htmlFor="Category" >Category</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="Category"
                                        id="Category"
                                        placeholder="Select Category"
                                        value={userInput}
                                        onChange={handleChange}
                                        onKeyDown={onKeyDown}
                                    />
                                </div>
                            </div>
                            {optionListCategory}
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label" htmlFor="SubCategory" >Sub Category</label>
                                <div className="col-sm-10">
                                    <select className="custom-select custom-select-sm mb-3"
                                        onChange={selectHandler}
                                        value={selSubCat} >
                                        <option value>Open this select menu</option>
                                        { //Object.keys(SubCategoryData).length
                                            // console.log(`subcategory data = ${SubCategoryData.name}`),
                                            SubCategoryData ?
                                                SubCategoryData.map((optionName, index) => {

                                                    return (
                                                        <option key={index} value={optionName.id}>
                                                            {optionName.name}
                                                        </option>
                                                    );
                                                })
                                                :
                                                ""}
                                    </select>
                                </div>
                            </div>

                            <div>
                                {currentFile && (
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-bar-info progress-bar-striped"
                                            role="progressbar"
                                            aria-valuenow={progress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            style={{ width: progress + "%" }}
                                        >
                                            {progress}%
          </div>
                                    </div>
                                )}

                                <label className="btn btn-default">
                                    <input type="file" onChange={selectFile} />
                                </label>

                                <div className="alert alert-light" role="alert">
                                    {message}
                                </div>
                            </div>
                            {selectedItem ?
                                        <div>
                                            <button
                                                   type="button"
                                                   className="btn btn-primary"
                                                   onClick={updateItem}
                                            >
                                                Update
             </button>
                                        </div>
                                        :
                                        <div>
                                            <button className="btn btn-primary" disabled={!selectedFiles} type="submit"> <FontAwesomeIcon icon={faPlus} />Add</button>

                                        </div>

                                    }
                            
                        </form>

                        {/* <div>

                            <i className="fa fa-sun-o" />
                            <i className="fa fa-spinner fa-spin" />
                            <i className="fa cofee"></i>
                        </div> */}
                    </div>
                </div>
                :
                "Access denied for the screen"}
        </div>
    );
}

const mapStateToProps = state => ({
    CategoryData: state.category.category,
    SubCategoryData: state.subCategory.subCategory,
    currentBrand: state.brand.currentBrand
})

const mapDispatchToProps = dispatch => ({
    fetchCategoryStartAsync: () => dispatch(fetchCategoryStartAsync()),
    fetchSubCategoryStartAsync: (id) => dispatch(fetchSubCategoryStartAsync(id))

});

export default connect(mapStateToProps, mapDispatchToProps)(AddItem);