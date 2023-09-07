import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { connect} from 'react-redux';

import { fetchCategoryStartAsync } from '../../redux/cateogry/category.actions';
import UploadService from "../../services/FileUploadService";
import subCategoryService from "../../services/subCategory";
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';


const SubCategory = ({ fetchCategoryStartAsync, CategoryData,currentUser }) => {

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeOption, setActiveOption] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selCat, setSelCat] = useState("");
  const [message, setMessage] = useState("");

  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState("");
  const [access,setAccess] = useState(false);

  useEffect(() => {
    checkAdmin().then((r) => { setContent(r);});
    setAccess(checkAccess("ADD SUBCATEGORY",currentUser.rights));
  }
, []);


  useEffect(() => {
    fetchCategoryStartAsync();

  }, [fetchCategoryStartAsync])

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  const upload = (id) => {
    let currentFile = selectedFiles[0];
    // console.log(`image brandid = ${id}`)
    setProgress(0);
    setCurrentFile(currentFile);
    console.log(currentFile);
    const lastDot = currentFile.name.lastIndexOf('.');
    const ext = currentFile.name.substring(lastDot + 1);
    var fn = `subcat${id}.${ext}`;
    //console.log(`file name should be ${fn}`);
    // file.originalname = `${req.body.filename}.${ext}`;

    UploadService.upload(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    }, fn, '\\App\\uploads\\subCategoriesImages\\')
      .then((response) => {
        if (process.env.REACT_APP_S3 ==="True"){
          setMessage(response.data.message);
          //console.log(response)
          fn = `${response.data.data.Location}`
          //console.log(fn)
          }
          else
          {
              setMessage(response.data.message);
            //  console.log(response.data.message)
          }
        var data = {
          imageUrl: fn
        };
        // console.log(`sending to update sub cat data
        // data = ${data}`)
        subCategoryService.update(id, data);

      })
      //   .then((files) => {
      //     setFileInfos(files.data);
      //   })
      .catch((error) => {
        console.log(`error message=${error.message}`);
        setProgress(0);
        setMessage("Could not upload the file!");
        //setMessage(response.data.message);
        setCurrentFile(undefined);
      });

    setSelectedFiles(undefined);
  };



  const saveSubCategory = () => {
    //console.log(`selected category = ${selCat}`)
    var data = {
      name: name,
      description: description,
      category: selCat
    };
    console.log(data)
    subCategoryService.create(data)
      .then(response => {
        // this.setState({
        //   id: response.data.id,
        //   name: response.data.name,
        //   description: response.data.description,
        //   url: response.data.url
        // });
        // console.log(response.status);
        // console.log(response.data.id);

        setMessage(`Sub Category successfully Added Id = ${response.data.id}`);
        console.log(response.data);

        // upload image
        upload(response.data.id);

        // update the 

      })
      .catch(e => {
        console.log(e);
      });
  }

  const handleSubmit = async event => {
    event.preventDefault();
    // //uploading image on firestore image name should be brand name
    // setLoading(true);

    //save sub Categories
    saveSubCategory();
    setLoading(false);
    setName("");
    setDescription("");



  }

  const onKeyDown = (e) => {
    // console.log("On change is fired")
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
    setSelCat(e.currentTarget.dataset.id);
   // console.log(e.currentTarget.dataset.id)

  };

  const handleChange = event => {
    console.log("handle change is fired")
    //console.log(event);
    if (event.target.id === "file") {
      //alert("file change event fired")
      //console.log(event.target.files[0]);
      //setFile(event.target.files[0]);

    }
    else if (event.target.id === "Name") {
      setName(event.target.value);
      // setFileName(event.target.value);
    }
    else if (event.target.id === "Description") {
      setDescription(event.target.value);
    }
    else if (event.target.id === "Category") {
      const options = CategoryData;
      const userInput = event.currentTarget.value;

      setFilteredOptions(CategoryData.filter(
        (option) => option.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    ));
      
      setActiveOption(0);
     // setFilteredOptions(filteredOptions);
      setShowOptions(true);
      setUserInput(userInput);
    }
  }

  let optionList;
  if (showOptions && userInput) {
    console.log(filteredOptions);
    console.log(filteredOptions.length)
    if (filteredOptions.length) {
      optionList = (
        <ul className="options">
          {filteredOptions.map((optionName, index) => {
            let className;
            if (index === activeOption) {
              className = 'option-active';
            }
            return (
              <li className={className} data-id={optionName.id} onClick={onClick}>
                {optionName.name}
              </li>
            );
          })}
        </ul>
      );
    } else {
      optionList = (
        <div className="no-options">
          <em>No Option!</em>
        </div>
      );
    }
  }




  return (
    <div>
    {access ?
    <div className="submit-form container">
       {content === "Admin Content." ?
                <div>

      <div className="inputFormHeader"><h1>Add New Sub Category</h1></div>
      <div className="inputForm">
      {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''}
      {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

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
          {optionList}
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
                content}
    </div>
      :
      "Access denied for the screen"}
      </div>
  );
}

const mapStateToProps = state => ({
  CategoryData: state.category.category,
  currentUser: state.user.user.user 
})

const mapDispatchToProps = dispatch => ({
  fetchCategoryStartAsync: () => dispatch(fetchCategoryStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);