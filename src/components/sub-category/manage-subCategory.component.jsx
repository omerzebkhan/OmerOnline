import React, { useState, useEffect } from 'react';



const ManageSubCategory = ({ currentSubCategory }) => {
    //  const d = currentBrand.description;
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    //console.log(description)

    useEffect(() => {
        setDescription(currentSubCategory.description);
    }, [currentSubCategory])


    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }

    const deleteBrand = () => {
      // Delete subCategory need to check 
    }



    const updateBrand = () => {
        const data = {
            id: currentSubCategory.id,
            description: description,
        };

        //update SubCategory need to check
    }
    return (
        <div>
            <h4>Update Sub Category</h4>
            {currentSubCategory ? (
                <div className="edit-form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={currentSubCategory.name}
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
                            <img src={currentSubCategory.imageUrl} alt="brandImage" width="100" height="100" />
                        </div>
                    </form>
                    <button
                        className="badge badge-danger mr-2"
                        onClick={deleteBrand}
                    >
                        Delete
                  </button>
                    <button
                        type="submit"
                        className="badge badge-success"
                        onClick={updateBrand}
                    >
                        Update
                  </button>
                    <p>{message}</p>
                </div>
            ) : (
                    <div>
                        <br />
                        <p>Please click on a Sub Category...</p>
                    </div>
                )}
        </div>
    )
}

export default ManageSubCategory;