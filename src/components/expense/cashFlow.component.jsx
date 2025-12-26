import React, { useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";

import cashFlowService from "../../services/cashFlow.services";
import { checkAccess } from '../../helper/checkAuthorization';

const CashFlow = ({ currentUser }) => {
    const [amount, setAmount] = useState("");
    const [comments, setComments] = useState("");
    const [mode, setMode] = useState("");
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success or danger
    const [loading, setLoading] = useState(false);
    const [access, setAccess] = useState(false);

    useLayoutEffect(() => {
        const hasAccess = checkAccess("ADD CASHFLOW", currentUser?.rights);
        setAccess(hasAccess || true); // Remove || true in production
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!amount || parseFloat(amount) <= 0) {
            setMessage("Please enter a valid amount greater than 0");
            setMessageType("danger");
            return;
        }
        if (!mode) {
            setMessage("Please select a mode (Cash/Bank)");
            setMessageType("danger");
            return;
        }
        if (!type) {
            setMessage("Please select a type (AR/AP)");
            setMessageType("danger");
            return;
        }

        setLoading(true);
        setMessage("");
        setMessageType("");

        const data = {
            amount: parseFloat(amount),
            comments: comments.trim(),
            mode: mode,
            type: type,
            outstanding: parseFloat(amount)
        };

        try {
            const response = await cashFlowService.create(data);
            setMessage(`Cash flow added successfully! ID: ${response.data.id}`);
            setMessageType("success");

            // Reset form
            setAmount("");
            setComments("");
            setMode("");
            setType("");
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to add cash flow";
            setMessage("Error: " + errorMsg);
            setMessageType("danger");
            console.error("Cash flow creation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "amount") {
            // Allow only numbers and decimal
            if (/^\d*\.?\d*$/.test(value) || value === "") {
                setAmount(value);
            }
        } else if (id === "comments") {
            setComments(value);
        } else if (id === "mode") {
            setMode(value);
        } else if (id === "type") {
            setType(value);
        }
    };

    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>You do not have permission to add cash flow entries.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white text-center">
                            <h2 className="mb-0">Add Cash Flow Entry</h2>
                        </div>
                        <div className="card-body p-4">
                            {message && (
                                <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                                    {message}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setMessage("")}
                                    ></button>
                                </div>
                            )}

                            {loading && (
                                <div className="text-center mb-4">
                                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
                                        <span className="visually-hidden">Saving...</span>
                                    </div>
                                    <p className="mt-3">Adding cash flow entry...</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="amount" className="form-label fw-bold">
                                        Amount <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text fw-bold">$</span>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="amount"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="mode" className="form-label fw-bold">
                                        Mode <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select form-select-lg"
                                        id="mode"
                                        value={mode}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Please Select</option>
                                        <option value="Bank">Bank</option>
                                        <option value="Cash">Cash</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="type" className="form-label fw-bold">
                                        Type <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select form-select-lg"
                                        id="type"
                                        value={type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Please Select</option>
                                        <option value="AR">Accounts Receivable (AR)</option>
                                        <option value="AP">Accounts Payable (AP)</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="comments" className="form-label fw-bold">
                                        Comments
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="comments"
                                        rows="4"
                                        placeholder="Optional notes about this cash flow..."
                                        value={comments}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg px-5"
                                        disabled={loading}
                                    >
                                        {loading ? "Adding..." : "Add Cash Flow"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.user.user
});

export default connect(mapStateToProps)(CashFlow);