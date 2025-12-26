import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";

import { fetchInventoryMismatchAsync } from '../../redux/item/item.action';
import { checkAccess } from '../../helper/checkAuthorization';

const InventoryMismatchReport = ({
    fetchInventoryMismatchAsync,
    itemData = [],
    isFetching,
    currentUser
}) => {
    const [access, setAccess] = useState(false);
    const [sortedData, setSortedData] = useState([]);
    const tableRef = useRef(null);

    useLayoutEffect(() => {
        const hasAccess = checkAccess("STOCK REPORT", currentUser?.rights);
        setAccess(hasAccess || true); // Remove || true in production!
    }, [currentUser]);

    useEffect(() => {
        fetchInventoryMismatchAsync();
    }, [fetchInventoryMismatchAsync]);

    // Safely sort data without mutating original
    useEffect(() => {
        if (Array.isArray(itemData) && itemData.length > 0) {
            const sorted = [...itemData].sort((a, b) => a.id - b.id);
            setSortedData(sorted);
        } else {
            setSortedData([]);
        }
    }, [itemData]);

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
                <h1 className="h3">Inventory Mismatch Report</h1>
                {sortedData.length > 0 && (
                    <DownloadTableExcel
                        filename="Inventory_Mismatch_Report"
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

            {isFetching ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading inventory data...</p>
                </div>
            ) : sortedData.length === 0 ? (
                <div className="alert alert-info text-center">
                    <h5>No Data Available</h5>
                    <p>There are no inventory mismatches to display at this time.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table ref={tableRef} className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Current Stock</th>
                                <th>Total Purchase</th>
                                <th>Total Sale</th>
                                <th>Purchase - Sale</th>
                                <th>Difference (Mismatch)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((item) => {
                                const calculatedDiff = item.totalpurchase - item.totalsale;
                                const mismatch = item.diff || item.quantity - calculatedDiff; // fallback if diff not provided

                                return (
                                    <tr
                                        key={item.id}
                                        className={mismatch !== 0 ? 'table-warning' : ''}
                                    >
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td className="text-center">{item.quantity ?? 0}</td>
                                        <td className="text-center">{item.totalpurchase ?? 0}</td>
                                        <td className="text-center">{item.totalsale ?? 0}</td>
                                        <td className="text-center">{calculatedDiff}</td>
                                        <td className="text-center fw-bold">
                                            <span className={mismatch !== 0 ? 'text-danger' : 'text-success'}>
                                                {mismatch}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="table-secondary">
                            <tr>
                                <th colSpan="7" className="text-end">
                                    Total Items: {sortedData.length}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Optional summary */}
            {sortedData.length > 0 && (
                <div className="mt-4 p-3 bg-light rounded">
                    <h5>Report Summary</h5>
                    <ul className="list-unstyled">
                        <li>• Total Items Checked: <strong>{sortedData.length}</strong></li>
                        <li>• Items with Mismatch: <strong>
                            {sortedData.filter(item => {
                                const calc = item.totalpurchase - item.totalsale;
                                const diff = item.diff || item.quantity - calc;
                                return diff !== 0;
                            }).length}
                        </strong></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.user.user,
    itemData: state.item.inventoryMismatch || [],
    isFetching: state.item.isFetching || false,
});

const mapDispatchToProps = (dispatch) => ({
    fetchInventoryMismatchAsync: () => dispatch(fetchInventoryMismatchAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(InventoryMismatchReport);