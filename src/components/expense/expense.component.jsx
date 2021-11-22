import React, { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'
import expenseService from "../../services/expense.service";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";




const Expense = () => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [expenseDate,setExpenseDate] = useState(new Date())
    const [message, setMessage] = useState("");
    


    const [content, setContent] = useState("");
    const [access, setAccess] = useState(false);

    const currentUser = useSelector((state) => state.user.user.user);

    useLayoutEffect(() => {
        checkAdmin().then((r) => { setContent(r); });
        setAccess(checkAccess("ADD EXPENSE", currentUser.rights));
    }
        , [currentUser.rights]);


    const handleSubmit = async event => {
        event.preventDefault();


        setLoading(true);
        //add brand info to DB
        saveExpense();

        setLoading(false);
        setName("");
        setDescription("");
        setAmount("");


    }


    const saveExpense = () => {

        var data = {
            name: name,
            description: description,
            amount: amount,
            expensedate : expenseDate
        };

        console.log(data)

        expenseService.create(data)
            .then(response => {
                setMessage(`Expense successfully Added Expense id = ${response.data.id}`);
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.response.request.response.message);
            });
    }

    const handleExpenseDate=date=> {
        setExpenseDate(date);
      }

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "file") {
            //alert("file change event fired")
            //console.log(event.target.files[0]);
            //setFile(event.target.files[0]);

        }
        else if (event.target.id === "Name") {
            setName(event.target.value);
            //setFileName(event.target.value);
        }
        else if (event.target.id === "Description") {
            setDescription(event.target.value);
        }
        else if (event.target.id === "Amount") {
            setAmount(event.target.value);
        }
    }




    return (
        <div className="submit-form">
            {content !== "Unauthorized!" ?
                <h3>{access ?
                    <div>



                        <div className="inputFormHeader"><h1>Add Expense</h1></div>
                        <div className="inputForm">
                            {loading ? <div className="alert alert-warning" role="alert">uploading....</div> : ''}
                            {message ? <div className="alert alert-warning" role="alert">{message}</div> : ""}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="Name">Name</label>
                                    <div className="col-sm-9">
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
                                    <label className="col-sm-3 col-form-label" htmlFor="Description" >Description</label>
                                    <div className="col-sm-9">
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
                                    <label className="col-sm-3 col-form-label" htmlFor="Amount" >Amount</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            name="Amount"
                                            id="Amount"
                                            placeholder="Amount"
                                            value={amount}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                <label className="col-sm-3 col-form-label" htmlFor="Expense Date" >Date</label>
                                <div className="col-sm-9">
                                    <DatePicker
                                        id="datePicker"
                                        selected={expenseDate}
                                        onChange={handleExpenseDate}
                                        name="expenseDate"
                                        dateFormat="MM/dd/yyyy"
                                    />
                                    </div>
                                </div>


                                <div>
                                    <button className="btn btn-primary" type="submit">Add</button>

                                </div>
                            </form>

                        </div>
                    </div>
                    :
                    "Access denied for the screen"}</h3>
                :
                content}

        </div>
    );
}

export default Expense;