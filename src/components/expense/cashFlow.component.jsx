import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import cashFlowService from "../../services/cashFlow.services";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

const CashFlow = ({
    currentUser
}) => {
    const [amount, setAmount] = useState();
    const [comments, setComments] = useState();
    const [mode,setMode] = useState();
    const [type,setType] = useState();
    const [message,setMessage] = useState();
    const [access, setAccess] = useState(false);

    useLayoutEffect(() => {
        // checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("ADD CASHFLOW", currentUser.rights));
        // console.log(`access value = ${access}`)
    }
        , []);

    const addHandler = () => {

        var data = {
            amount: amount,
            comments: comments,
            mode:mode,
            type:type,
            outstanding:amount

        };
        console.log(data)

        cashFlowService.create(data)
            .then(response => {
               setMessage(`Cash Flow successfully Added id = ${response.data.id}`);
                //console.log(response.data);
            })
            .catch(error => {
                console.log(error.response.request.response.message);
            });
    
    }

    const handleChange = event => {

        if (event.target.id === "amount") {
            setAmount(event.target.value);
        }
        else if (event.target.id === "comments") {
            setComments(event.target.value);

        }
        else if (event.target.id === "type") {
            setType(event.target.value);
        }
        else if (event.target.id === "mode") {
            setMode(event.target.value);
        }
        
    }

    return (
        <div>
             <div><h1>Add Cash Flow</h1></div>
                        <div className="inputForm">
                            
                            {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}
             </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="Name">Amount</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        name="Amount"
                        id="amount"
                        placeholder="Amount"
                        value={amount}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="Name">Mode</label>
                <div className="col-sm-10">

                    <select id="mode" name="Mode" onChange={handleChange}>
                        <option defaultValue="Please Select">Please Select</option>
                        <option value="Bank">Bank</option>
                        <option value="Cash">Cash</option>
                    </select>

                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="Name">Type</label>
                <div className="col-sm-10">
                    <select id="type" name="Type" onChange={handleChange}>
                        <option defaultValue="Please Select">Please Select</option>
                        <option value="AR">AR</option>
                        <option value="AP">AP</option>
                    </select>

                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="Name">Comments</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        name="Comments"
                        id="comments"
                        placeholder="Comments"
                        value={comments}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div >
            <button className="btn btn-success" type="button" onClick={addHandler} >ADD</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    itemData: state.item.items,
    currentUser: state.user.user.user,
    currentItem: state.item.currentItem
})

export default connect(mapStateToProps)(CashFlow);
