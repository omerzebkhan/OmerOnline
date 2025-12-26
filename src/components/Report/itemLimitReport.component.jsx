import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";

import { checkAccess } from '../../helper/checkAuthorization';
import itemService from "../../services/item.services";

const ItemLimitReport = ({ currentUser }) => {
    const tableRef = useRef(null);

    const [itemLimit, setItemLimit] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [loading, setLoading] = useState(true);
    const [access, setAccess] = useState(false);

    const pageSizeOptions = [10, 15, 25, 50, 100, 200];

    useLayoutEffect(() => {
        setAccess(checkAccess("ITEMLIMIT REPORT", currentUser?.rights || []));
    }, [currentUser]);

    useEffect(() => {
        setLoading(true);
        itemService.getItemlimitReport()
            .then(response => {
                setItemLimit(response.data || []);
            })
            .catch(error => {
                console.error("Error fetching item limit report:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    // Filtered & sorted items
    const processedItems = useMemo(() => {
        let result = [...itemLimit];

        // Search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(term)
            );
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
    }, [itemLimit, searchTerm, sortConfig]);

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

    const calculateOrderQuantity = (item) => {
        const qty = parseFloat(item.quantity) || 0;
        const sales = {
            30: parseFloat(item.totalsale30days) || 0,
            90: parseFloat(item.totalsale90days) || 0,
            180: parseFloat(item.totalsale180days) || 0,
            365: parseFloat(item.totalsale365days) || 0
        };

        if (qty > sales[30]) return 0;
        if (sales[30] > 0 && qty <= sales[30]) return sales[30] - qty;
        if (sales[90] > 0 && qty <= sales[90]) return sales[90] - qty;
        if (sales[180] > 0 && qty <= sales[180]) return sales[180] - qty;
        if (sales[365] > 0 && qty <= sales[365]) return sales[365] - qty;
        return "No match found";
    };

    if (!access) {
        return <div className="container mt-5"><div className="alert alert-danger text-center">Access Denied</div></div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center fw-bold">Item Limit Report</h1>

            <div className="card mb-4 shadow">
                <div className="card-body">
                    {/* Search & Export */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Search by Item Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type item name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 text-end align-self-end">
                            <DownloadTableExcel
                                filename="Item_Limit_Report"
                                sheet="ItemLimit"
                                currentTableRef={tableRef.current}
                            >
                                <button className="btn btn-success">Download as Excel</button>
                            </DownloadTableExcel>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading item limit data...</p>
                        </div>
                    ) : processedItems.length === 0 ? (
                        <div className="alert alert-info text-center">
                            No items found matching your search.
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="table-responsive mb-3">
                                <table className="table table-striped table-hover" ref={tableRef}>
                                    <thead className="table-dark">
                                        <tr>
                                            <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>
                                                ID {getSortIcon('id')}
                                            </th>
                                            <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                                                Item Name {getSortIcon('name')}
                                            </th>
                                            <th onClick={() => requestSort('quantity')} style={{ cursor: 'pointer' }}>
                                                Quantity {getSortIcon('quantity')}
                                            </th>
                                            <th onClick={() => requestSort('totalsale')} style={{ cursor: 'pointer' }}>
                                                Total Sale {getSortIcon('totalsale')}
                                            </th>
                                            <th onClick={() => requestSort('totalsale30days')} style={{ cursor: 'pointer' }}>
                                                30 Days {getSortIcon('totalsale30days')}
                                            </th>
                                            <th onClick={() => requestSort('totalsale90days')} style={{ cursor: 'pointer' }}>
                                                90 Days {getSortIcon('totalsale90days')}
                                            </th>
                                            <th onClick={() => requestSort('totalsale180days')} style={{ cursor: 'pointer' }}>
                                                180 Days {getSortIcon('totalsale180days')}
                                            </th>
                                            <th onClick={() => requestSort('totalsale365days')} style={{ cursor: 'pointer' }}>
                                                365 Days {getSortIcon('totalsale365days')}
                                            </th>
                                            <th>Order Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.totalsale}</td>
                                                <td>{item.totalsale30days}</td>
                                                <td>{item.totalsale90days}</td>
                                                <td>{item.totalsale180days}</td>
                                                <td>{item.totalsale365days}</td>
                                                <td className="fw-bold text-primary">
                                                    {calculateOrderQuantity(item)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                                {/* Items per page selector */}
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

                                {/* Showing info */}
                                <div className="text-muted text-center mb-2 mb-md-0">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                    {Math.min(currentPage * itemsPerPage, processedItems.length)} of {processedItems.length} items
                                </div>

                                {/* Page numbers */}
                                {totalPages > 1 && (
                                    <nav>
                                        <ul className="pagination mb-0">
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    currentUser: state.user.user
});

export default connect(mapStateToProps)(ItemLimitReport);