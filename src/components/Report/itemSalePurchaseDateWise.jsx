import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";

import itemServices from '../../services/item.services';
import { checkAccess } from '../../helper/checkAuthorization';
import {formatDate} from  '../../helper/formatting';

const ItemSalePurchaseDateWise = ({ currentUser }) => {
    const tableRef = useRef(null);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [itemInput, setItemInput] = useState("");
    const [itemSalePurchase, setItemSalePurchase] = useState([]);
    const [itemList, setItemList] = useState([]); // Backup for filtering
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [access, setAccess] = useState(false);

    const pageSizeOptions = [10, 15, 25, 50, 100];

    useLayoutEffect(() => {
        setAccess(checkAccess("MONTHLYSALE", currentUser?.rights || []));
    }, [currentUser]);

    // Summary totals (fixed with useMemo)
    const summary = useMemo(() => {
        if (!itemSalePurchase.length) return {
            records: 0,
            totalQty: 0,
            totalPurchaseQty: 0,
            totalPurchaseValue: 0,
            totalSaleQty: 0,
            totalSaleValue: 0,
            totalSaleProfit: 0
        };

        return itemSalePurchase.reduce((acc, item) => ({
            records: acc.records + 1,
            totalQty: acc.totalQty + (parseFloat(item.quantity) || 0),
            totalPurchaseQty: acc.totalPurchaseQty + (parseInt(item.pquantity) || 0),
            totalPurchaseValue: acc.totalPurchaseValue + (parseFloat(item.pvalue) || 0),
            totalSaleQty: acc.totalSaleQty + (parseInt(item.squantity) || 0),
            totalSaleValue: acc.totalSaleValue + (parseFloat(item.svalue) || 0),
            totalSaleProfit: acc.totalSaleProfit + (parseFloat(item.sprofit) || 0)
        }), {
            records: 0,
            totalQty: 0,
            totalPurchaseQty: 0,
            totalPurchaseValue: 0,
            totalSaleQty: 0,
            totalSaleValue: 0,
            totalSaleProfit: 0
        });
    }, [itemSalePurchase]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setHasSearched(true);

        itemServices.getSalePurchaseDateWise(formatDate(startDate), formatDate(endDate))
            .then(response => {
                const data = response.data || [];
                setItemSalePurchase(data);
                setItemList(data);
            })
            .catch(error => {
                console.error("Error fetching sale/purchase data:", error);
            })
            .finally(() => setLoading(false));
    };

    // Filtered & sorted items
    const processedItems = useMemo(() => {
        let result = [...itemSalePurchase];

        // Search filter (exactly as you had it)
        if (itemInput.trim()) {
            const term = itemInput.toLowerCase();
            result = result.filter(item => item.name.toLowerCase().includes(term));
        }

        // Sorting
        if (sortConfig.key) {
            result = result.sort((a, b) => {
                const aVal = sortConfig.key === 'name' ? a[sortConfig.key] : parseFloat(a[sortConfig.key]) || 0;
                const bVal = sortConfig.key === 'name' ? b[sortConfig.key] : parseFloat(b[sortConfig.key]) || 0;

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [itemSalePurchase, itemInput, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(processedItems.length / itemsPerPage);
    const paginatedItems = processedItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [processedItems, itemsPerPage]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const handlePrint = () => window.print();

    if (!access) {
        return <div className="container mt-5"><div className="alert alert-danger text-center">Access Denied</div></div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center fw-bold">Item Sale Purchase Datewise</h1>

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
                                <label className="form-label fw-bold">Item Name (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type item name..."
                                    value={itemInput}
                                    onChange={(e) => setItemInput(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Loading..." : "Search"}
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
                            <p className="mt-2">Loading data...</p>
                        </div>
                    )}

                    {/* No Data */}
                    {!loading && processedItems.length === 0 && (
                        <div className="text-center my-5">
                            <div className="alert alert-info d-inline-block">
                                <h5>No records found</h5>
                                <p className="mb-0">Try adjusting the date range or item name.</p>
                            </div>
                        </div>
                    )}

                    {/* Table & Actions */}
                    {!loading && processedItems.length > 0 && (
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Item Sale Purchase Datewise</h4>
                                <div>
                                    <DownloadTableExcel
                                        filename={`item_sale_purchase_${startDate.toISOString().slice(0,10)}_${endDate.toISOString().slice(0,10)}`}
                                        sheet="SalePurchase"
                                        currentTableRef={tableRef.current}
                                    >
                                        <button className="btn btn-success me-2">Export Excel</button>
                                    </DownloadTableExcel>
                                    <button className="btn btn-secondary" onClick={handlePrint}>Print</button>
                                </div>
                            </div>
                            <div className="card-body">
                                {/* Summary */}
                                <div className="card mb-3">
                                    <div className="card-header bg-success text-white">
                                        <h5 className="mb-0">Summary</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Records</th>
                                                        <th>Stock Qty</th>
                                                        <th>Purchase Qty</th>
                                                        <th>Purchase Value</th>
                                                        <th>Sale Qty</th>
                                                        <th>Sale Value</th>
                                                        <th>Sale Profit</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="table-info fw-bold">
                                                        <td>{summary.records}</td>
                                                        <td>{summary.totalQty.toFixed(3)}</td>
                                                        <td>{summary.totalPurchaseQty.toFixed(3)}</td>
                                                        <td>{summary.totalPurchaseValue.toFixed(3)}</td>
                                                        <td>{summary.totalSaleQty.toFixed(3)}</td>
                                                        <td>{summary.totalSaleValue.toFixed(3)}</td>
                                                        <td>{summary.totalSaleProfit.toFixed(3)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Pagination Controls */}
                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                    <div className="d-flex align-items-center mb-2 mb-md-0">
                                        <label className="me-2 fw-bold text-nowrap">Show:</label>
                                        <select
                                            className="form-select"
                                            style={{ width: 'auto' }}
                                            value={itemsPerPage}
                                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        >
                                            {pageSizeOptions.map(n => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="ms-2 text-nowrap">items per page</span>
                                    </div>

                                    <div className="text-muted text-center mb-2 mb-md-0">
                                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                        {Math.min(currentPage * itemsPerPage, processedItems.length)} of {processedItems.length} items
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="table-responsive mb-4">
                                    <table className="table table-striped table-hover" ref={tableRef}>
                                        <thead className="table-dark">
                                            <tr>
                                                <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>
                                                    Item ID {getSortIcon('id')}
                                                </th>
                                                <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                                                    Name {getSortIcon('name')}
                                                </th>
                                                <th onClick={() => requestSort('code')} style={{ cursor: 'pointer' }}>
                                                    Code {getSortIcon('code')}
                                                </th>
                                                <th onClick={() => requestSort('description')} style={{ cursor: 'pointer' }}>
                                                    Description {getSortIcon('description')}
                                                </th>
                                                <th onClick={() => requestSort('quantity')} style={{ cursor: 'pointer' }}>
                                                    Stock Qty {getSortIcon('quantity')}
                                                </th>
                                                <th onClick={() => requestSort('pquantity')} style={{ cursor: 'pointer' }}>
                                                    Purchase Qty {getSortIcon('pquantity')}
                                                </th>
                                                <th onClick={() => requestSort('pvalue')} style={{ cursor: 'pointer' }}>
                                                    Purchase Value {getSortIcon('pvalue')}
                                                </th>
                                                <th onClick={() => requestSort('squantity')} style={{ cursor: 'pointer' }}>
                                                    Sale Qty {getSortIcon('squantity')}
                                                </th>
                                                <th onClick={() => requestSort('svalue')} style={{ cursor: 'pointer' }}>
                                                    Sale Value {getSortIcon('svalue')}
                                                </th>
                                                <th onClick={() => requestSort('sprofit')} style={{ cursor: 'pointer' }}>
                                                    Sale Profit {getSortIcon('sprofit')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.code}</td>
                                                    <td>{item.description || "-"}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.pquantity}</td>
                                                    <td>{parseFloat(item.pvalue || 0).toFixed(3)}</td>
                                                    <td>{parseFloat(item.squantity || 0).toFixed(3)}</td>
                                                    <td>{parseFloat(item.svalue || 0).toFixed(3)}</td>
                                                    <td>{parseFloat(item.sprofit || 0).toFixed(3)}</td>
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
                    )}
                </>
            )}

            {/* Initial State */}
            {!hasSearched && (
                <div className="text-center my-5 text-muted">
                    <h4>Please use the search form above to generate the report</h4>
                    <p>Select date range and optionally enter an item name, then click Search.</p>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    currentUser: state.user.user
});

export default connect(mapStateToProps)(ItemSalePurchaseDateWise);