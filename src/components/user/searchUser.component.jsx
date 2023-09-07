import { React, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Pagination from "@material-ui/lab/Pagination";
// import { useTable } from "react-table";

import { fetchUserStartAsync, setCurrentUser } from '../../redux/user/user.action';
import AddUser from './addUser.component';


const SearchUser = ({
     fetchUserStartAsync,
     setCurrentUser,
     isFetching, userData, errorMessage, currentUser, show }) => {


    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(3);

    const pageSizes = [50, 100, 200];

   const getRequestParams = (page, pageSize) => {
       
        let params = {};

       
        if (page) {
            params["page"] = page - 1;
        }

        if (pageSize) {
           params["size"] = pageSize;
        }

        return params;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
       
        ////////////////////////Paging logic//////////////////////
        

        if (show ==="AccRec")
        {
            fetchUserStartAsync();
        }
        else if (show === "AccPay"){
            fetchUserStartAsync();
        }
        else{
            const params = getRequestParams(page, pageSize);
        fetchUserStartAsync(params);
        if (userData){
        setCount(userData.totalPages)
        }
        }
     
        /////////////////////////////////////////////////////////
    }

    const handlePageChange = (event, value) => {
        setPage(value);
        const params = getRequestParams(value, pageSize);
        // console.log(`page = ${params.page}   pageSize = ${params.pageSize} `)
           fetchUserStartAsync(params);
           if (userData){
           setCount(userData.totalPages)
           }
        
    };

    const handlePageSizeChange = (event) => {
        console.log(event.target.value)
        setPageSize(event.target.value);
        setPage(1);
    };


    return (
        <div>
            <div className="searchFormHeader"><h1>Search User</h1></div>
            <div className="searchForm">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Name">Name</label>
                        <input
                            type="text"
                            name="Name"
                            id="Name"
                            placeholder="Name"
                        />
            Description
            <input
                            type="text"
                            name="Description"
                            id="Description"
                            placeholder="Description"
                        />
                    </div>
                    <div >
                        <button className="btn btn-success" type="submit" >Search</button>

                    </div>
                    <div className="col-md-12 list">
                                        <div className="mt-3">
                                            {"Items per Page: "}
                                            <select onChange={handlePageSizeChange} value={pageSize}>
                                                {pageSizes.map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>

                                            <Pagination
                                                className="my-3"
                                                count={count}
                                                page={page}
                                                siblingCount={1}
                                                boundaryCount={1}
                                                variant="outlined"
                                                shape="rounded"
                                                onChange={handlePageChange}
                                            />
                                        </div>
                                        </div>
                </form>
                {isFetching ? <div className="alert alert-warning" role="alert">loading....</div> : ''}
                {errorMessage ? <div className="alert alert-danger" role="alert">{this.props.errorMessage}</div> : ""}

                {userData ?
                    (() => {
                        switch (show) {
                            case "AccRec": return (
                                <div>
                                    <h3>Account Receivable View</h3>
                                    <table border='1'>

                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Name</th>
                                                <th>Mobile</th>
                                                <th>Ph</th>
                                                <th>email</th>
                                                <th>Address</th>
                                                <th>Role</th>
                                                <th>TotalInvoice</th>
                                                <th>OutStanding</th>
                                                <th>Description</th>
                                                <th>Comments</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>


                                            {userData ?
                                                userData.user
                                                    .filter(function (item) { return item.roles.toUpperCase() === "CUSTOMER" && item.outstanding>0 })
                                                    .map((user, index) => (
                                                        //   console.log(item);

                                                        <tr key={index}
                                                            onClick={() => setCurrentUser(user)}>
                                                            <td>{user.id}</td>
                                                            <td>{user.name}</td>
                                                            <td>{user.mobile}</td>
                                                            <td>{user.ph}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.address}</td>
                                                            <td>{user.roles}</td>
                                                            <td>{user.totalamount}</td>
                                                            <td>{user.outstanding}</td>
                                                            <td>{user.desctiption}</td>
                                                            <td>{user.comments}</td>
                                                            <td>{user.status}</td>
                                                        </tr>))
                                                :
                                                "no data found"
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            );
                            case "AccPay": return (
                                <div>
                                    <h3>Account PayAble View</h3>
                                    <table border='1'>

                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Name</th>
                                                <th>Mobile</th>
                                                <th>Ph</th>
                                                <th>email</th>
                                                <th>Address</th>
                                                <th>Role</th>
                                                <th>TotalInvoice</th>
                                                <th>OutStanding</th>
                                                <th>Description</th>
                                                <th>Comments</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userData ?
                                                userData.user
                                                    .filter(function (item) { return item.roles.toUpperCase() === "SUPPLIER" })
                                                    .map((user, index) => (
                                                        //   console.log(item);    
                                                        <tr key={index}
                                                            onClick={() => setCurrentUser(user)}>
                                                            <td>{user.id}</td>
                                                            <td>{user.name}</td>
                                                            <td>{user.mobile}</td>
                                                            <td>{user.ph}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.address}</td>
                                                            <td>{user.roles}</td>
                                                            <td>{user.totalamount}</td>
                                                            <td>{user.outstanding}</td>
                                                            <td>{user.desctiption}</td>
                                                            <td>{user.comments}</td>
                                                            <td>{user.status}</td>
                                                        </tr>)) :
                                                "no data found"}
                                        </tbody>
                                    </table>
                                </div>
                            );
                            default: return (
                                <div>
                                    <h3>User View</h3>
                                    
                                        <table border='1'>
                                            <thead>
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Name</th>
                                                    <th>Mobile</th>
                                                    <th>Ph</th>
                                                    <th>email</th>
                                                    <th>Address</th>
                                                    <th>Roles</th>
                                                    <th>Description</th>
                                                    <th>Comments</th>
                                                    <th>status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userData ?
                                                    userData.user.map((user, index) => (
                                                        //   console.log(item);
                                                        <tr key={index}
                                                            onClick={() => setCurrentUser(user)}>
                                                            <td>{user.id}</td>
                                                            <td>{user.name}</td>
                                                            <td>{user.mobile}</td>
                                                            <td>{user.ph}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.address}</td>
                                                            <td>{user.roles}</td>
                                                            <td>{user.desctiption}</td>
                                                            <td>{user.comments}</td>
                                                            <td>{user.status}</td>
                                                        </tr>))
                                                    :
                                                    "no data found"
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            }
                        })()

                        :
                        ""}
                                    <div className="col-md-6">
                                        {console.log(show)}
                                        {currentUser && !show ? (
                                            //Object.keys(currentBrand).length? (
                                            
                                            <div>
                                               
                                                <AddUser selectedUser={currentUser} />

                                            </div>
                                        ) : (
                                                <div>
                                                    <br />
                                                    <p>Please click on a User...</p>
                                                </div>
                                            )}
                                    </div>

                                </div>
            </div>
        )

}

    const mapStateToProps = state => ({
        userData: state.user.users,
        isFetching: state.user.isFetching,
        errorMessage: state.user.errorMessage,
        currentUser: state.user.currentUser

    })

    const mapDispatchToProps = dispatch => ({
        fetchUserStartAsync: (params) => dispatch(fetchUserStartAsync(params)),
        setCurrentUser: (id) => dispatch(setCurrentUser(id))
    });

    export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);
