import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import inventoryService from '../../services/inventory.service';
import { checkAccess } from '../../helper/checkAuthorization';
import {formatDate} from  '../../helper/formatting';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlySale = ({ currentUser }) => {
    const tableRef = useRef(null);

    const [saleMonthly, setSaleMonthly] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [itemInput, setItemInput] = useState("");
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setHasSearched(true);

        inventoryService.getMonthlySale(formatDate(startDate), formatDate(endDate))
            .then(response => {
                setSaleMonthly(response.data || []);
                setFilteredOptionsItem(response.data || []);
            })
            .catch(error => {
                console.error("Error fetching monthly sale:", error);
            })
            .finally(() => setLoading(false));
    };

    // Sorting
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

    // Sorted items
    const sortedItems = useMemo(() => {
        let result = [...filteredOptionsItem];

        // if (sortConfig.key) {
        //     result = result.sort((a, b) => {
        //         const aVal = sortConfig.key === 'name' ? a[sortConfig.key] : parseFloat(a[sortConfig.key]) || 0;
        //         const bVal = sortConfig.key === 'name' ? b[sortConfig.key] : parseFloat(b[sortConfig.key]) || 0;

        //         if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        //         if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        //         return 0;
        //     });
        // }

        return result;
    }, [filteredOptionsItem, sortConfig]);

    // Chart data
    const chartData = useMemo(() => {
        if (sortedItems.length === 0) return null;

        const labels = sortedItems.map(item => item.month);
        const totalsale = sortedItems.map(item => parseFloat(item.totalsale) || 0);
        const profit = sortedItems.map(item => parseFloat(item.profit) || 0);

        return {
            labels,
            datasets: [
                {
                    label: 'Total Sale',
                    data: totalsale,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Total Profit',
                    data: profit,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2
                }
            ]
        };
    }, [sortedItems]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Monthly Sale & Profit Trend'
            },
            legend: {
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }), []);

    // Pagination
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const paginatedItems = sortedItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [sortedItems, itemsPerPage]);

    const handlePrint = () => window.print();

    if (!access) {
        return <div className="container mt-5"><div className="alert alert-danger text-center">Access Denied</div></div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center fw-bold">Monthly Sale Report</h1>

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
                            <p className="mt-2">Loading monthly sale data...</p>
                        </div>
                    )}

                    {/* No Data */}
                    {!loading && sortedItems.length === 0 && (
                        <div className="text-center my-5">
                            <div className="alert alert-info d-inline-block">
                                <h5>No monthly sale records found</h5>
                                <p className="mb-0">Try adjusting the date range or item name.</p>
                            </div>
                        </div>
                    )}

                    {/* Table & Chart */}
                    {!loading && sortedItems.length > 0 && (
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Monthly Sale Report</h4>
                                <div>
                                    <DownloadTableExcel
                                        filename={`monthly_sale_${startDate.toISOString().slice(0,10)}_${endDate.toISOString().slice(0,10)}`}
                                        sheet="MonthlySale"
                                        currentTableRef={tableRef.current}
                                    >
                                        <button className="btn btn-success me-2">Export Excel</button>
                                    </DownloadTableExcel>
                                    <button className="btn btn-secondary" onClick={handlePrint}>Print</button>
                                </div>
                            </div>
                            <div className="card-body">
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
                                        {Math.min(currentPage * itemsPerPage, sortedItems.length)} of {sortedItems.length} items
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="table-responsive mb-4">
                                    <table className="table table-striped table-hover" ref={tableRef}>
                                        <thead className="table-dark">
                                            <tr>
                                                <th onClick={() => requestSort('month')} style={{ cursor: 'pointer' }}>
                                                    Month {getSortIcon('month')}
                                                </th>
                                                <th onClick={() => requestSort('totalsale')} style={{ cursor: 'pointer' }}>
                                                    Total Sale {getSortIcon('totalsale')}
                                                </th>
                                                <th onClick={() => requestSort('totalitem')} style={{ cursor: 'pointer' }}>
                                                    Total Items {getSortIcon('totalitem')}
                                                </th>
                                                <th onClick={() => requestSort('profit')} style={{ cursor: 'pointer' }}>
                                                    Total Profit {getSortIcon('profit')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.month}</td>
                                                    <td>{parseFloat(item.totalsale || 0).toFixed(3)}</td>
                                                    <td>{item.totalitem}</td>
                                                    <td>{parseFloat(item.profit || 0).toFixed(3)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Chart */}
                                <div className="mb-4">
                                    <div className="chart-container" style={{ position: 'relative', height: '400px' }}>
                                        <Bar data={chartData} options={chartOptions} />
                                    </div>
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
                    <h4>Please use the search form above to generate the monthly sale report</h4>
                    <p>Select date range and optionally enter an item name, then click Search.</p>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    currentUser: state.user.user
});

export default connect(mapStateToProps)(MonthlySale);