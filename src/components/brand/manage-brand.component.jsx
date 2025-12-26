import React, { useState, useEffect } from 'react';



const ManageComponent = ({ currentBrand }) => {
   
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');


    useEffect(() => {
        setDescription(currentBrand.description);
    }, [currentBrand])


    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }
  
    const deleteBrand = () => {
       //delete brand
    }



    const updateBrand = () => {
       
//update description of the brand
    setMessage(`Update is under development .....`);

}
    return (
        <div>
            <h4>Update Brand</h4>
            
            {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

            {currentBrand ? (
                <div className="edit-form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={currentBrand.name}
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
                            <img src={currentBrand.imageUrl} alt="brandImage" width="100" height="100" />
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

export default ManageComponent;