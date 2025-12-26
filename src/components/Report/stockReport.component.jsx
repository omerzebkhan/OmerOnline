import React, { useRef, useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchItemStartAsync } from '../../redux/item/item.action';
import itemService from "../../services/item.services";
import { checkAccess } from '../../helper/checkAuthorization';
import { DownloadTableExcel } from "react-export-table-to-excel";

const StockReport = ({
    fetchItemStartAsync, itemData, isFetching, currentUser
}) => {
    const tableRef = useRef(null);

    // Access control
    const [access, setAccess] = useState(false);
    useLayoutEffect(() => {
        setAccess(checkAccess("STOCK REPORT", currentUser?.rights || []));
    }, [currentUser]);

    // Search & Filter
    const [nameSearch, setNameSearch] = useState("");
    const [filterType, setFilterType] = useState("Please Select");
    const [filterField, setFilterField] = useState("Please Select");
    const [filterValue, setFilterValue] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // New: items per page selector

    const pageSizeOptions = [10, 25, 50, 100];

    // History states
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [saleHistory, setSaleHistory] = useState([]);
    const [returnHistory, setReturnHistory] = useState([]);
    const [activeHistory, setActiveHistory] = useState(null);

    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync]);

    // Filtered items
    const filteredItems = useMemo(() => {
        if (!itemData || !Array.isArray(itemData)) return [];

        let result = itemData.slice().sort((a, b) => a.id - b.id);

        if (nameSearch.trim()) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(nameSearch.toLowerCase())
            );
        }

        if (filterType !== "Please Select" && filterField !== "Please Select" && filterValue) {
            const val = parseFloat(filterValue);
            if (!isNaN(val)) {
                result = result.filter(item => {
                    const fieldValue = parseFloat(item[filterField]) || 0;
                    if (filterType === "Equal To") return fieldValue === val;
                    if (filterType === "Greater Than") return fieldValue > val;
                    if (filterType === "Less Than") return fieldValue < val;
                    return true;
                });
            }
        }

        return result;
    }, [itemData, nameSearch, filterType, filterField, filterValue]);

    // Pagination logic
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset page when filters or itemsPerPage change
    useEffect(() => {
        setCurrentPage(1);
    }, [nameSearch, filterType, filterField, filterValue, itemsPerPage]);

    // Totals (all filtered items)
    const totals = useMemo(() => {
        const totalQty = filteredItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalValue = filteredItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.averageprice || 0), 0);
        return {
            totalQty,
            totalRecords: filteredItems.length,
            totalValue: totalValue.toFixed(3)
        };
    }, [filteredItems]);

    // History totals
    const purchaseTotals = useMemo(() => ({
        qty: purchaseHistory.reduce((s, i) => s + (i.quantity || 0), 0),
        records: purchaseHistory.length
    }), [purchaseHistory]);

    const saleTotals = useMemo(() => ({
        qty: saleHistory.reduce((s, i) => s + (i.quantity || 0), 0),
        records: saleHistory.length
    }), [saleHistory]);

    const returnTotals = useMemo(() => ({
        qty: returnHistory.reduce((s, i) => s + (i.quantity || 0), 0),
        records: returnHistory.length
    }), [returnHistory]);

    // History loaders
    const showPurchaseHistory = async (itemId) => {
        try {
            const res = await itemService.getItemPurchaseHistory(itemId);
            setPurchaseHistory(res.data || []);
            setActiveHistory("purchase");
        } catch (e) {
            console.error("Purchase history error:", e);
        }
    };

    const showSaleHistory = async (itemId) => {
        try {
            const res = await itemService.getItemSaleHistory(itemId);
            setSaleHistory(res.data || []);
            setActiveHistory("sale");
        } catch (e) {
            console.error("Sale history error:", e);
        }
    };

    const showReturnHistory = async (itemId) => {
        try {
            const res = await itemService.getItemReturnHistory(itemId);
            setReturnHistory(res.data || []);
            setActiveHistory("return");
        } catch (e) {
            console.error("Return history error:", e);
        }
    };

    const closeHistory = () => setActiveHistory(null);

    if (!access) {
        return <div className="container mt-4"><div className="alert alert-danger">Access denied</div></div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Stock Report</h1>

            {isFetching && <div className="alert alert-info mb-4">Loading data...</div>}

            {/* Search & Filter */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label">Search by Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type item name..."
                                value={nameSearch}
                                onChange={(e) => setNameSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Filter</label>
                            <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                <option>Please Select</option>
                                <option>Equal To</option>
                                <option>Greater Than</option>
                                <option>Less Than</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Field</label>
                            <select className="form-select" value={filterField} onChange={(e) => setFilterField(e.target.value)}>
                                <option>Please Select</option>
                                <option value="averageprice">Average Cost</option>
                                <option value="quantity">Quantity</option>
                                <option value="online">Online Qty</option>
                                <option value="showroom">Showroom Qty</option>
                                <option value="warehouse">Warehouse Qty</option>
                                <option value="onlineprice">Online Price</option>
                                <option value="showroomprice">Showroom Price</option>
                                <option value="onlinediscount">Online Discount</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Value</label>
                            <input
                                type="number"
                                className="form-control"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary + Export */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Summary</h5>
                            <p className="mb-1">Total Quantity: <strong>{totals.totalQty}</strong></p>
                            <p className="mb-1">Total Records: <strong>{totals.totalRecords}</strong></p>
                            <p className="mb-0">Inventory Value: <strong>{totals.totalValue}</strong></p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 text-end align-self-center">
                    <DownloadTableExcel filename="stock_report" sheet="Stock" currentTableRef={tableRef.current}>
                        <button className="btn btn-success btn-lg">Export to Excel</button>
                    </DownloadTableExcel>
                </div>
            </div>

            {/* Main Stock Table with Pagination */}
            <div className="card mb-4">
                <div className="card-body">
                    <h3 className="mb-3">Stock View</h3>

                    {/* Pagination Top Bar */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="text-muted">
                            Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} items
                        </div>
                        <div className="d-flex align-items-center">
                            <label className="me-2 mb-0">Items per page:</label>
                            <select
                                className="form-select w-auto"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                {pageSizeOptions.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover" ref={tableRef}>
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Avg Cost</th>
                                    <th>Qty</th>
                                    <th>Online</th>
                                    <th>Showroom</th>
                                    <th>Warehouse</th>
                                    <th>O. Price</th>
                                    <th>S. Price</th>
                                    <th>Discount</th>
                                    <th>Invest1</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.length === 0 ? (
                                    <tr><td colSpan="12" className="text-center py-4">No items found</td></tr>
                                ) : (
                                    paginatedItems.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{parseFloat(item.averageprice || 0).toFixed(3)}</td>
                                            <td>{item.quantity || 0}</td>
                                            <td>{item.online || 0}</td>
                                            <td>{item.showroom || 0}</td>
                                            <td>{item.warehouse || 0}</td>
                                            <td>{item.onlineprice || 0}</td>
                                            <td>{item.showroomprice || 0}</td>
                                            <td>{item.onlinediscount || 0}</td>
                                            <td>{item.investone || 0}</td>
                                            <td>
                                                <button className="btn btn-sm btn-primary me-1" onClick={() => showPurchaseHistory(item.id)}>
                                                    Purchase
                                                </button>
                                                <button className="btn btn-sm btn-success me-1" onClick={() => showSaleHistory(item.id)}>
                                                    Sale
                                                </button>
                                                <button className="btn btn-sm btn-warning" onClick={() => showReturnHistory(item.id)}>
                                                    Return
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <nav aria-label="Page navigation" className="mt-4">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                                        Previous
                                    </button>
                                </li>

                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => goToPage(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>

            {/* History Sections (unchanged - only one shows) */}
            {activeHistory === "purchase" && purchaseHistory.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                        <h4 className="mb-0">Purchase History</h4>
                        <button className="btn btn-light btn-sm" onClick={closeHistory}>✕ Close</button>
                    </div>
                    <div className="card-body">
                        <p className="mb-3">
                            Total Quantity: <strong>{purchaseTotals.qty}</strong> | 
                            Records: <strong>{purchaseTotals.records}</strong>
                        </p>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="table-light">
                                    <tr><th>Invoice ID</th><th>Supplier</th><th>Item</th><th>Detail ID</th><th>Cost</th><th>Qty</th><th>Date</th></tr>
                                </thead>
                                <tbody>
                                    {purchaseHistory.map((h, i) => (
                                        <tr key={i}>
                                            <td>{h.id}</td>
                                            <td>{h.supplierName || '-'}</td>
                                            <td>{h.itemName}</td>
                                            <td>{h.InvPurId}</td>
                                            <td>{h.price}</td>
                                            <td>{h.quantity}</td>
                                            <td>{new Date(h.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeHistory === "sale" && saleHistory.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center bg-success text-white">
                        <h4 className="mb-0">Sale History</h4>
                        <button className="btn btn-light btn-sm" onClick={closeHistory}>✕ Close</button>
                    </div>
                    <div className="card-body">
                        <p className="mb-3">
                            Total Quantity: <strong>{saleTotals.qty}</strong> | 
                            Records: <strong>{saleTotals.records}</strong>
                        </p>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="table-light">
                                    <tr><th>Invoice ID</th><th>Customer</th><th>Item</th><th>Detail ID</th><th>Price</th><th>Qty</th><th>Date</th></tr>
                                </thead>
                                <tbody>
                                    {saleHistory.map((h, i) => (
                                        <tr key={i}>
                                            <td>{h.id}</td>
                                            <td>{h.customerName || '-'}</td>
                                            <td>{h.itemName}</td>
                                            <td>{h.InvPurId}</td>
                                            <td>{h.price}</td>
                                            <td>{h.quantity}</td>
                                            <td>{new Date(h.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeHistory === "return" && returnHistory.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center bg-warning text-dark">
                        <h4 className="mb-0">Return History</h4>
                        <button className="btn btn-light btn-sm" onClick={closeHistory}>✕ Close</button>
                    </div>
                    <div className="card-body">
                        <p className="mb-3">
                            Total Quantity: <strong>{returnTotals.qty}</strong> | 
                            Records: <strong>{returnTotals.records}</strong>
                        </p>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="table-light">
                                    <tr><th>Sale Invoice</th><th>Return ID</th><th>Item</th><th>Qty</th><th>Date</th></tr>
                                </thead>
                                <tbody>
                                    {returnHistory.map((h, i) => (
                                        <tr key={i}>
                                            <td>{h.saleInvoiceId}</td>
                                            <td>{h.id}</td>
                                            <td>{h.name}</td>
                                            <td>{h.quantity}</td>
                                            <td>{new Date(h.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    currentUser: state.user.user,
    itemData: state.item.items,
    isFetching: state.item.isFetching
});

const mapDispatchToProps = {
    fetchItemStartAsync
};

export default connect(mapStateToProps, mapDispatchToProps)(StockReport);