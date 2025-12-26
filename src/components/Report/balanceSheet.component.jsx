import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";
import inventoryService from '../../services/inventory.service';
import { checkAccess } from '../../helper/checkAuthorization';

const BalanceSheet = ({ currentUser }) => {
    const tableRef = useRef(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [access, setAccess] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const pageSizeOptions = [10, 15, 25, 50, 100];

    useLayoutEffect(() => {
        const hasAccess = checkAccess("BALANCESHEET", currentUser?.rights || []);
        setAccess(hasAccess);
    }, [currentUser]);

    // Calculate totals and cumulative profit
    const processedData = useMemo(() => {
        if (!data || data.length === 0) return { rows: [], totals: {} };

        let cumulativeProfit = 0;
        const rows = data.map(item => {
            cumulativeProfit += parseFloat(item.totalProfit) || 0;
            return {
                ...item,
                cumulativeProfit: cumulativeProfit.toFixed(3)
            };
        });

        const totals = rows.reduce((acc, item) => ({
            totalSale: acc.totalSale + (parseFloat(item.totalSale) || 0),
            totalProfit: acc.totalProfit + (parseFloat(item.totalProfit) || 0),
            totalPurchase: acc.totalPurchase + (parseFloat(item.totalPurchase) || 0),
            totalExpense: acc.totalExpense + (parseFloat(item.totalExpense) || 0),
            totalCashReceived: acc.totalCashReceived + (parseFloat(item.totalCashReceived) || 0),
            totalBankReceived: acc.totalBankReceived + (parseFloat(item.totalBankReceived) || 0),
            totalCashPaid: acc.totalCashPaid + (parseFloat(item.totalCashPaid) || 0),
            totalBankPaid: acc.totalBankPaid + (parseFloat(item.totalBankPaid) || 0),
        }), {
            totalSale: 0, totalProfit: 0, totalPurchase: 0, totalExpense: 0,
            totalCashReceived: 0, totalBankReceived: 0, totalCashPaid: 0, totalBankPaid: 0
        });

        return { rows, totals: { records: rows.length, ...totals } };
    }, [data]);

    // Pagination logic
    const { rows: displayRows, totals } = processedData;
    const totalPages = Math.ceil(displayRows.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRows = displayRows.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage, data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setData([]);

        try {
            const response = await inventoryService.getBalanceSheetByDate(
                startDate.toDateString(),
                endDate.toDateString()
            );

            const rawData = response.data || [];

            if (rawData.length === 0) {
                setMessage("No records found for the selected date range.");
                setLoading(false);
                return;
            }

            // Sort newest first
            const sorted = rawData.sort((a, b) => {
                const dateA = a.date.split('/').reverse().join('');
                const dateB = b.date.split('/').reverse().join('');
                return dateB.localeCompare(dateA);
            });

            setData(sorted);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.errorMessage || "Failed to load data.";
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>You do not have permission to view the Balance Sheet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center fw-bold">Balance Sheet Report</h1>

            {/* Date Picker Form */}
            <div className="card mb-4 shadow">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3 align-items-end">
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
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Messages */}
            {message && <div className="alert alert-info text-center">{message}</div>}

            {/* Loading */}
            {loading && (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="mt-3">Loading balance sheet data...</p>
                </div>
            )}

            {/* Results */}
            {!loading && displayRows.length > 0 && (
                <>
                    {/* Action Buttons */}
                    <div className="mb-4 text-end">
                        <DownloadTableExcel filename={`balancesheet_${startDate.toISOString().slice(0,10)}_${endDate.toISOString().slice(0,10)}`} sheet="BalanceSheet" currentTableRef={tableRef.current}>
                            <button className="btn btn-success me-2">
                                Export to Excel
                            </button>
                        </DownloadTableExcel>
                        <button className="btn btn-secondary" onClick={handlePrint}>
                            Print Report
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="card mb-4 shadow">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0">Summary ({startDate.toLocaleDateString()} - {endDate.toLocaleDateString()})</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Records</th>
                                            <th>Total Sale</th>
                                            <th>Total Profit</th>
                                            <th>Cumulative Profit</th>
                                            <th>Total Purchase</th>
                                            <th>Total Expense</th>
                                            <th>Cash Received</th>
                                            <th>Bank Received</th>
                                            <th>Cash Paid</th>
                                            <th>Bank Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="table-primary fw-bold">
                                            <td>{totals.records}</td>
                                            <td>{totals.totalSale.toFixed(3)}</td>
                                            <td>{totals.totalProfit.toFixed(3)}</td>
                                            <td>{displayRows[displayRows.length - 1]?.cumulativeProfit || '0.000'}</td>
                                            <td>{totals.totalPurchase.toFixed(3)}</td>
                                            <td>{totals.totalExpense.toFixed(3)}</td>
                                            <td>{totals.totalCashReceived.toFixed(3)}</td>
                                            <td>{totals.totalBankReceived.toFixed(3)}</td>
                                            <td>{totals.totalCashPaid.toFixed(3)}</td>
                                            <td>{totals.totalBankPaid.toFixed(3)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Table with Pagination */}
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Daily Balance Sheet Details</h4>
                            <div>
                                <label className="text-white me-2">Rows per page:</label>
                                <select className="form-select d-inline-block w-auto" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                                    {pageSizeOptions.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover" ref={tableRef}>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Date</th>
                                            <th>Sale</th>
                                            <th>Profit</th>
                                            <th>Cumulative Profit</th>
                                            <th>Purchase</th>
                                            <th>Expense</th>
                                            <th>Cash Rec.</th>
                                            <th>Bank Rec.</th>
                                            <th>Cash Paid</th>
                                            <th>Bank Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRows.map((item, i) => (
                                            <tr key={i}>
                                                <td><strong>{item.date}</strong></td>
                                                <td>{parseFloat(item.totalSale || 0).toFixed(3)}</td>
                                                <td>{parseFloat(item.totalProfit || 0).toFixed(3)}</td>
                                                <td className="fw-bold text-success">{item.cumulativeProfit}</td>
                                                <td>{parseFloat(item.totalPurchase || 0).toFixed(3)}</td>
                                                <td>{parseFloat(item.totalExpense || 0).toFixed(3)}</td>
                                                <td>{parseFloat(item.totalCashReceived || 0).toFixed(3)}</td>
                                                <td>{parseFloat(item.totalBankReceived || 0).toFixed(3)}</td>
                                                <td>{parseFloat(item.totalCashPaid || 0).toFixed(3)}</td>
                                                <td>{parseFloat(item.totalBankPaid || 0).toFixed(3)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(currentPage - 1)}>Previous</button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(currentPage + 1)}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.user.user,
});

export default connect(mapStateToProps)(BalanceSheet);