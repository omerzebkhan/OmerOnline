import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";

import { fetchEditPurchase } from '../../redux/purchase/purchase.action';
import { fetchItemStartAsync } from '../../redux/item/item.action';
import { checkAccess } from '../../helper/checkAuthorization';

const EditPurchaseReport = ({
    fetchEditPurchase,
    editPurchaseData = [],
    fetchItemStartAsync,
    itemData = [],
    currentUser,
    isFetchingItems
}) => {
    const tableRef = useRef(null);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [invoiceNo, setInvoiceNo] = useState("");
    const [message, setMessage] = useState("");
    const [access, setAccess] = useState(false);

    // Item Search Dropdown
    const [itemSearch, setItemSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState(null); // { id, name, showroom, averageprice, showroomprice }
    const [showDropdown, setShowDropdown] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const pageSizeOptions = [10, 15, 25, 50, 100];

    useLayoutEffect(() => {
        const hasAccess = checkAccess("SALE RETURN", currentUser?.rights || []);
        setAccess(hasAccess);
    }, [currentUser]);

    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync]);

    // Filtered items for dropdown
    const filteredItems = useMemo(() => {
        if (!itemSearch.trim()) return [];
        return itemData.filter(item =>
            item.name.toLowerCase().includes(itemSearch.toLowerCase())
        ).slice(0, 10); // limit for performance
    }, [itemData, itemSearch]);

    // Pagination logic
    const totalPages = Math.ceil(editPurchaseData.length / itemsPerPage);
    const paginatedData = editPurchaseData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [editPurchaseData, itemsPerPage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        const itemId = selectedItem ? selectedItem.id : "0";
        const inv = invoiceNo.trim() || "0";

        fetchEditPurchase(
            startDate.toLocaleDateString('en-US'),
            endDate.toLocaleDateString('en-US'),
            itemId,
            inv
        );
    };

    const selectItem = (item) => {
        setSelectedItem(item);
        setItemSearch(item.name);
        setShowDropdown(false);
    };

    const clearItem = () => {
        setSelectedItem(null);
        setItemSearch("");
    };

    const handlePrint = () => window.print();

    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>You do not have permission to view the Purchase Edit Report.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center fw-bold">Purchase Edit Report</h1>

            {/* Search Form */}
            <div className="card mb-4 shadow">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-3">
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
                                <label className="form-label fw-bold">Invoice No.</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter invoice number (optional)"
                                    value={invoiceNo}
                                    onChange={(e) => setInvoiceNo(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Item Search</label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Type to search item..."
                                        value={itemSearch}
                                        onChange={(e) => {
                                            setItemSearch(e.target.value);
                                            setShowDropdown(true);
                                        }}
                                        onFocus={() => itemSearch && setShowDropdown(true)}
                                    />
                                    {selectedItem && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger position-absolute end-0 top-50 translate-middle-y me-2"
                                            onClick={clearItem}
                                            style={{ zIndex: 10 }}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown */}
                                {showDropdown && filteredItems.length > 0 && (
                                    <div className="position-absolute bg-white border rounded shadow mt-1" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto', width: '100%' }}>
                                        <table className="table table-sm table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Showroom Qty</th>
                                                    <th>Cost</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredItems.map(item => (
                                                    <tr
                                                        key={item.id}
                                                        className="cursor-pointer"
                                                        onClick={() => selectItem(item)}
                                                    >
                                                        <td><strong>{item.name}</strong></td>
                                                        <td>{item.showroom || 0}</td>
                                                        <td>{parseFloat(item.averageprice || 0).toFixed(3)}</td>
                                                        <td>{parseFloat(item.showroomprice || 0).toFixed(3)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {showDropdown && itemSearch && filteredItems.length === 0 && (
                                    <div className="position-absolute bg-white border rounded shadow p-3 mt-1" style={{ zIndex: 1000 }}>
                                        <em>No items found</em>
                                    </div>
                                )}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Showroom Quantity</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedItem?.showroom || ""}
                                    disabled
                                    placeholder="N/A"
                                />
                            </div>

                            <div className="col-md-3 align-self-end">
                                <button type="submit" className="btn btn-primary w-100">
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            {/* Results */}
            {editPurchaseData.length > 0 && (
                <>
                    {/* Action Buttons */}
                    <div className="mb-4 text-end">
                        <DownloadTableExcel
                            filename={`purchase_edit_report_${startDate.toISOString().slice(0,10)}_${endDate.toISOString().slice(0,10)}`}
                            sheet="EditReport"
                            currentTableRef={tableRef.current}
                        >
                            <button className="btn btn-success me-2">Export Excel</button>
                        </DownloadTableExcel>
                        <button className="btn btn-secondary" onClick={handlePrint}>Print</button>
                    </div>

                    {/* Table */}
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Purchase Edit History</h4>
                            <div>
                                <label className="text-white me-2">Rows per page:</label>
                                <select
                                    className="form-select d-inline-block w-auto"
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                >
                                    {pageSizeOptions.map(n => <option key={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover" ref={tableRef}>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Purchase ID</th>
                                            <th>Detail ID</th>
                                            <th>Item Name</th>
                                            <th>Old Price</th>
                                            <th>Old Qty</th>
                                            <th>New Price</th>
                                            <th>New Qty</th>
                                            <th>Final Qty</th>
                                            <th>Before Edit Qty</th>
                                            <th>Comments</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.id}</td>
                                                <td>{item.purchaseinvoiceid}</td>
                                                <td>{item.purchasedetailid}</td>
                                                <td><strong>{item.name}</strong></td>
                                                <td>{parseFloat(item.oldprice || 0).toFixed(3)}</td>
                                                <td>{item.oldqty}</td>
                                                <td>{parseFloat(item.newprice || 0).toFixed(3)}</td>
                                                <td>{item.newqty}</td>
                                                <td>{item.finalqty}</td>
                                                <td>{item.beforeqty}</td>
                                                <td>{item.comments || "-"}</td>
                                                <td>{new Date(item.createdAt).toLocaleString()}</td>
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

            {!editPurchaseData.length && !message && (
                <div className="text-center my-5 text-muted">
                    <h5>Enter search criteria and click Search to view results</h5>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    currentUser: state.user.user,
    editPurchaseData: state.purchase.editPurchase || [],
    itemData: state.item.items || [],
    isFetchingItems: state.item.isFetching
});

const mapDispatchToProps = {
    fetchEditPurchase,
    fetchItemStartAsync,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPurchaseReport);