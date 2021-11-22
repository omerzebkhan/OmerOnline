import React, { useState, useEffect } from 'react';



const ManageCategory = ({ currentCategory }) => {
    //  const d = currentBrand.description;
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [cCategory,setcCategory]=useState([]);
    //console.log(description)

    useEffect(() => {
        setDescription(currentCategory.description);
        setcCategory(currentCategory);
        setMessage("");
    }, [currentCategory])


    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }

    const deleteCategory = () => {
        //check before delete if category is assigned to any subcategory
       
    }

    const updateCategory = () => {
        const data = {
            id: cCategory.id,
            description: description,
        };
        // update category
       
    }
    return (
        <div>
            <h4>Update Category</h4>
            <p>{message ?
                message
                :
                ""}</p>
            {cCategory ? (
                <div className="edit-form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={cCategory.name}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                value={description}
                                onChange={onChangeDescription}

                            />
                        </div>

                        <div className="form-group">
                            <img src={cCategory.imageUrl} alt="brandImage" width="100" height="100" />
                        </div>
                    </form>
                    <button
                        className="badge badge-danger mr-2"
                        onClick={deleteCategory}
                    >
                        Delete
                  </button>
                    <button
                        type="submit"
                        className="badge badge-success"
                        onClick={updateCategory}
                    >
                        Update
                  </button>
                    
                </div>
            ) : (
                    <div>
                        <br />
                        <p>Please click on a Tutorial...</p>
                    </div>
                )}
        </div>
    )
}

export default ManageCategory;