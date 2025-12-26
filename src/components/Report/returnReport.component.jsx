import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { fetchSaleReturnByDate, fetchSaleReturnDetail } from '../../redux/Sale/sale.action';
import { checkAccess } from '../../helper/checkAuthorization';

const ReturnReport = ({
    fetchSaleReturnByDate,
    saleReturnData = [],
    fetchSaleReturnDetail,
    saleReturnDetailData = [],
    currentUser
}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [nameInput, setNameInput] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [access, setAccess] = useState(false);

    // Summary totals
    const summary = useMemo(() => {
        if (!saleReturnData.length) return { records: 0, totalItems: 0 };
        return saleReturnData.reduce((acc, item) => ({
            records: acc.records + 1,
            totalItems: acc.totalItems + parseInt(item.quantity || 0)
        }), { records: 0, totalItems: 0 });
    }, [saleReturnData]);

    useLayoutEffect(() => {
        setAccess(checkAccess("SALERETURN REPORT", currentUser?.rights || []));
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setHasSearched(true);

        const customerName = nameInput.trim() || "0";
        const sDate = startDate ? startDate.toLocaleDateString('en-US') : "0";
        const eDate = endDate ? endDate.toLocaleDateString('en-US') : "0";

        fetchSaleReturnByDate(customerName, sDate, eDate);
    };

    const selectInvoice = (item) => {
        fetchSaleReturnDetail(item.saleInvoiceId);
    };

    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">Access Denied</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center fw-bold">Sale Return Report</h1>

            {/* Search Form */}
            <div className="card mb-4 shadow">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Start Date</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={setStartDate}
                                    className="form-control"
                                    dateFormat="MM/dd/yyyy"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">End Date</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={setEndDate}
                                    className="form-control"
                                    dateFormat="MM/dd/yyyy"
                                    minDate={startDate}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Customer Name (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter customer name"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-end">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results only after search */}
            {hasSearched && (
                <>
                    {/* Loading */}
                    {loading && (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* No Data */}
                    {!loading && saleReturnData.length === 0 && (
                        <div className="text-center my-5">
                            <div className="alert alert-info d-inline-block">
                                <h5>No return records found</h5>
                                <p className="mb-0">Try adjusting the date range or customer name.</p>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {!loading && saleReturnData.length > 0 && (
                        <>
                            {/* Summary */}
                            <div className="card mb-4 shadow">
                                <div className="card-header bg-success text-white">
                                    <h4 className="mb-0">Return Summary</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row text-center">
                                        <div className="col-md-6">
                                            <h5>Total Records</h5>
                                            <h3 className="text-primary">{summary.records}</h3>
                                        </div>
                                        <div className="col-md-6">
                                            <h5>Total Returned Items</h5>
                                            <h3 className="text-danger">{summary.totalItems}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Table */}
                            <div className="card shadow mb-4">
                                <div className="card-header bg-primary text-white">
                                    <h4 className="mb-0">Return Invoices</h4>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Sale Invoice</th>
                                                    <th>Quantity</th>
                                                    <th>Customer</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {saleReturnData.map((item) => (
                                                    <tr
                                                        key={item.saleInvoiceId}
                                                        className="cursor-pointer"
                                                        onClick={() => selectInvoice(item)}
                                                    >
                                                        <td>{item.saleInvoiceId}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.name || "N/A"}</td>
                                                        <td>{new Date(item.cAt).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Details Table */}
                            {saleReturnDetailData.length > 0 && (
                                <div className="card shadow">
                                    <div className="card-header bg-info text-white">
                                        <h4 className="mb-0">Return Invoice Details</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Sale Invoice ID</th>
                                                        <th>Item Name</th>
                                                        <th>Quantity</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {saleReturnDetailData.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.id}</td>
                                                            <td>{item.saleInvoiceId}</td>
                                                            <td>{item.name || "N/A"}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Initial State */}
            {!hasSearched && (
                <div className="text-center my-5 text-muted">
                    <h4>Please use the search form above to generate a return report</h4>
                    <p>Enter date range and/or customer name, then click Search.</p>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    currentUser: state.user.user,
    saleReturnData: state.sale.saleReturn || [],
    saleReturnDetailData: state.sale.saleReturnDetail || []
});

const mapDispatchToProps = {
    fetchSaleReturnByDate,
    fetchSaleReturnDetail
};

export default connect(mapStateToProps, mapDispatchToProps)(ReturnReport);