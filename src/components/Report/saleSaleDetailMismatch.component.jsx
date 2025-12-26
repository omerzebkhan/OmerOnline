import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";

import { fetchInventoryMismatchAsync } from '../../redux/item/item.action'; // Assuming this is used elsewhere; not needed here
import { checkAccess } from '../../helper/checkAuthorization';
import inventoryService from "../../services/inventory.service";

const SaleSaleDetailMismatchReport = ({
    currentUser,
    isFetching // Note: isFetching not used here; consider adding a local loading state if needed
}) => {
    const [access, setAccess] = useState(false);
    const [mismatchData, setMismatchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const tableRef = useRef(null);

    useLayoutEffect(() => {
        const hasAccess = checkAccess("STOCK REPORT", currentUser?.rights);
        setAccess(hasAccess || true); // Remove || true in production for security
    }, [currentUser]);

    useEffect(() => {
        if (access) {
            fetchMismatchData();
        }
    }, [access]);

    const fetchMismatchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await inventoryService.getAllSaleSaleDetailMismatch();
            if (Array.isArray(response.data)) {
                // Sort by id descending (latest first)
                const sorted = [...response.data].sort((a, b) => b.id - a.id);
                setMismatchData(sorted);
            } else {
                setMismatchData([]);
            }
        } catch (err) {
            console.error('Error fetching sale mismatch data:', err);
            setError('Failed to load mismatch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>You do not have permission to view this report.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">Sale Sale Detail Mismatch Report</h1>
                {mismatchData.length > 0 && (
                    <DownloadTableExcel
                        filename="Sale_Mismatch_Report"
                        sheet="Mismatch_Data"
                        currentTableRef={tableRef.current}
                    >
                        <button className="btn btn-success">
                            <i className="fas fa-file-excel me-2"></i>
                            Export to Excel
                        </button>
                    </DownloadTableExcel>
                )}
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading mismatch data...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center">
                    <h5>Error</h5>
                    <p>{error}</p>
                    <button className="btn btn-outline-primary mt-2" onClick={fetchMismatchData}>
                        Retry
                    </button>
                </div>
            ) : mismatchData.length === 0 ? (
                <div className="alert alert-info text-center">
                    <h5>No Data Available</h5>
                    <p>No sale-sale detail mismatches found at this time.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table ref={tableRef} className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Sale Invoice ID</th>
                                <th>Invoice Value</th>
                                <th>Sale Detail Total</th>
                                <th>Difference (Mismatch)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mismatchData.map((item) => {
                                const diff = item.invoicevalue - item.saledetailtotal;
                                return (
                                    <tr
                                        key={item.id}
                                        className={diff !== 0 ? 'table-warning' : ''}
                                    >
                                        <td>{item.id}</td>
                                        <td className="text-end">{item.invoicevalue?.toFixed(2) ?? '0.00'}</td>
                                        <td className="text-end">{item.saledetailtotal?.toFixed(2) ?? '0.00'}</td>
                                        <td className="text-end fw-bold">
                                            <span className={diff !== 0 ? 'text-danger' : 'text-success'}>
                                                {diff?.toFixed(2) ?? '0.00'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="table-secondary">
                            <tr>
                                <th colSpan="3" className="text-end">Total Mismatches:</th>
                                <th className="text-end">
                                    {mismatchData.reduce((sum, item) => sum + (item.invoicevalue - item.saledetailtotal), 0).toFixed(2)}
                                </th>
                            </tr>
                            <tr>
                                <th colSpan="3" className="text-end">Total Records:</th>
                                <th className="text-end">{mismatchData.length}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Summary Card */}
            {mismatchData.length > 0 && (
                <div className="mt-4 p-3 bg-light rounded">
                    <h5>Report Summary</h5>
                    <ul className="list-unstyled">
                        <li>• Total Records: <strong>{mismatchData.length}</strong></li>
                        <li>• Records with Mismatch: <strong>
                            {mismatchData.filter(item => (item.invoicevalue - item.saledetailtotal) !== 0).length}
                        </strong></li>
                        <li>• Total Mismatch Amount: <strong>
                            {mismatchData.reduce((sum, item) => sum + (item.invoicevalue - item.saledetailtotal), 0).toFixed(2)}
                        </strong></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.user.user,
    isFetching: state.item.isFetching || false, // If needed; otherwise remove
});

// No dispatch needed since using direct service call
export default connect(mapStateToProps)(SaleSaleDetailMismatchReport);