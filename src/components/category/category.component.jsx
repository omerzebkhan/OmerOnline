import React, { useState, useLayoutEffect } from 'react';
import {useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'
import categoryService from "../../services/category.services";
import UploadService from "../../services/FileUploadService";
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';



const Category = () => {

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");


    //const [categoryId, setCategoryId] = useState("");
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);

    const [content, setContent] = useState("");
    const [access,setAccess] = useState(false);

    const currentUser = useSelector((state) => state.user.user.user);

    useLayoutEffect(() => {
        checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("ADD CATEGORY",currentUser.rights));
        
    }
        , []);

    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
    };

    const upload = (id) => {
        let currentFile = selectedFiles[0];
        console.log(`image categoryid = ${id}`)
        setProgress(0);
        setCurrentFile(currentFile);
        console.log(currentFile);
        const lastDot = currentFile.name.lastIndexOf('.');

        const ext = currentFile.name.substring(lastDot + 1);
        var fn = `${id}.${ext}`;
        // console.log(`file name should be ${fn}`);
        // file.originalname = `${req.body.filename}.${ext}`;

        UploadService.upload(currentFile, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }, fn, '\\App\\uploads\\categoriesImages\\')
            .then((response) => {
                setMessage(response.data.message);
                console.log(response.data.message)
                //return UploadService.getFiles();

                //update the file name with extension to the category url
                var data = {
                    imageUrl: fn
                };
                // console.log(`sending to update category data
                // id =${id}
                // data = ${data.imageUrl}`)
                categoryService.update(id, data);

            })
            //   .then((files) => {
            //     setFileInfos(files.data);
            //   })
            .catch((error) => {
                console.log(`error message=${error.response.request.response.message}`);
                setProgress(0);
                setMessage(error.response.request.response.message);
                //setMessage(response.data.message);
                setCurrentFile(undefined);
            });
    }

    const saveCategory = () => {

        var data = {
            name: name,
            description: description
        };

        categoryService.create(data)
            .then(response => {

                //setCategoryId(response.data.id);

                setMessage(`Category successfully Added category id = ${response.data.id}`);
                console.log(response.data);

                // upload image
                upload(response.data.id);

                // update the 

            })
            .catch(error => {
                console.log(error.response.request.response.message);
            });
    }


    const handleSubmit = async event => {
        event.preventDefault();


        //uploading image on firestore image name should be category name
        setLoading(true);
        //add category info to DB
        saveCategory();

        setLoading(false);
        setName("");
        setDescription("");


    }

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "file") {
            //alert("file change event fired")
            // console.log(event.target.files[0]);
            // setFile(event.target.files[0]);

        }
        else if (event.target.id === "Name") {
            setName(event.target.value);
            //    setFileName(event.target.value);
        }
        else if (event.target.id === "Description") {
            setDescription(event.target.value);
        }
    }




    return (
        <div className="submit-form">
            <h3>{access ?
                <div>
                    <div className="inputFormHeader"><h1>Add New Category</h1>
                        {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''}
                        {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

                    </div>
                    <div className="inputForm">
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


                            </div>

                            <div>
                                <button className="btn btn-primary" disabled={!selectedFiles} type="submit">Add</button>

                            </div>
                        </form>
                    </div>
                </div>
                :
                "Access denied for the screen"}</h3>
        </div>
    );
}

export default Category;