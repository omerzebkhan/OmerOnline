import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";


import {
    fetchSaleByDate,
    fetchSaleInvoiceDetailAsync,
    fetchSaleByDateSummary
} from '../../redux/Sale/sale.action';
import { fetchUserStartAsync } from '../../redux/user/user.action';
import { checkAccess } from '../../helper/checkAuthorization';

import PdfInvoice from "./printInvoice";
import PrintSaleSummary from './printSaleSummary';

const SaleReport = ({
    fetchSaleByDate,
    fetchSaleInvoiceDetailAsync,
    fetchSaleByDateSummary,
    fetchUserStartAsync,
    currentUser,
    saleData = [],
    saleSummary = [],
    saleInvoiceDetailData = [],
    userData = { user: [] }
}) => {
    const tableRef = useRef(null);
    const detailTableRef = useRef(null);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [invoiceNo, setInvoiceNo] = useState("");
    const [message, setMessage] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    // Customer & Agent
    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

    const [agentSearch, setAgentSearch] = useState("");
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showAgentDropdown, setShowAgentDropdown] = useState(false);

    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const pageSizeOptions = [10, 15, 25, 50, 100];

    const [access, setAccess] = useState(false);


    useLayoutEffect(() => {
        setAccess(checkAccess("SALE REPORT", currentUser?.rights || []));
    }, [currentUser]);

    useEffect(() => {
        fetchUserStartAsync();
    }, [fetchUserStartAsync]);

    const filteredCustomers = useMemo(() => {
        if (!customerSearch.trim()) return [];
        return userData.user
            .filter(u => u.roles?.toUpperCase() === "CUSTOMER" && u.name.toLowerCase().includes(customerSearch.toLowerCase()))
            .slice(0, 10);
    }, [userData.user, customerSearch]);

    const filteredAgents = useMemo(() => {
        if (!agentSearch.trim()) return [];
        return userData.user
            .filter(u => u.roles?.toUpperCase() === "SALEAGENT" && u.name.toLowerCase().includes(agentSearch.toLowerCase()))
            .slice(0, 10);
    }, [userData.user, agentSearch]);

    const summary = useMemo(() => {
        if (!saleData.length) return { records: 0, totalItems: 0, totalValue: 0, totalProfit: 0 };
        return saleData.reduce((acc, inv) => ({
            records: acc.records + 1,
            totalItems: acc.totalItems + parseInt(inv.totalitems || 0),
            totalValue: acc.totalValue + parseFloat(inv.invoicevalue || 0),
            totalProfit: acc.totalProfit + parseFloat(inv.profit || 0)
        }), { records: 0, totalItems: 0, totalValue: 0, totalProfit: 0 });
    }, [saleData]);

    const totalPages = Math.ceil(saleData.length / itemsPerPage);
    const paginatedData = saleData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [saleData, itemsPerPage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setHasSearched(true);
        setSelectedInvoice(null);
        setMessage("");

        if (invoiceNo.trim()) {
            fetchSaleInvoiceDetailAsync(invoiceNo.trim());
        } else {
            const custId = selectedCustomer ? selectedCustomer.id : "0";
            const agentId = selectedAgent ? selectedAgent.id : "0";

            fetchSaleByDate(
                startDate.toLocaleDateString('en-US'),
                endDate.toLocaleDateString('en-US'),
                custId,
                agentId,
                "0",
                "0"
            );

            fetchSaleByDateSummary(
                startDate.toLocaleDateString('en-US'),
                endDate.toLocaleDateString('en-US')
            );
        }
    };

    const selectInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        fetchSaleInvoiceDetailAsync(invoice.saleInvoiceId);
    };

    const clearCustomer = () => {
        setSelectedCustomer(null);
        setCustomerSearch("");
    };

    const clearAgent = () => {
        setSelectedAgent(null);
        setAgentSearch("");
    };

    const handlePrint = () => window.print();

    if (!access) return <div className="container mt-5"><div className="alert alert-danger text-center">Access Denied</div></div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center fw-bold">Sale Report</h1>

            {/* Search Form */}
            <div className="card mb-4 shadow">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Date Pickers */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Start Date</label>
                                <DatePicker selected={startDate} onChange={setStartDate} className="form-control" dateFormat="MM/dd/yyyy" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">End Date</label>
                                <DatePicker selected={endDate} onChange={setEndDate} className="form-control" dateFormat="MM/dd/yyyy" minDate={startDate} />
                            </div>
                            <div className="col-md-4 align-self-end">
                                <button type="submit" className="btn btn-primary w-100">Search</button>
                            </div>
                        </div>

                        {/* Customer & Agent */}
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Customer</label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search customer..."
                                        value={customerSearch}
                                        onChange={(e) => {
                                            setCustomerSearch(e.target.value);
                                            setShowCustomerDropdown(true);
                                        }}
                                    />
                                    {selectedCustomer && <button type="button" className="btn btn-sm btn-outline-danger position-absolute end-0 top-50 translate-middle-y me-2" onClick={clearCustomer}>✕</button>}
                                </div>
                                {showCustomerDropdown && filteredCustomers.length > 0 && (
                                    <div className="position-absolute bg-white border rounded shadow mt-1" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto', width: '100%' }}>
                                        <table className="table table-sm table-hover mb-0">
                                            <thead className="table-light"><tr><th>Name</th><th>Address</th></tr></thead>
                                            <tbody>
                                                {filteredCustomers.map(c => (
                                                    <tr key={c.id} onClick={() => { setSelectedCustomer(c); setCustomerSearch(c.name); setShowCustomerDropdown(false); }}>
                                                        <td><strong>{c.name}</strong></td>
                                                        <td>{c.address || "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Agent</label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search agent..."
                                        value={agentSearch}
                                        onChange={(e) => {
                                            setAgentSearch(e.target.value);
                                            setShowAgentDropdown(true);
                                        }}
                                    />
                                    {selectedAgent && <button type="button" className="btn btn-sm btn-outline-danger position-absolute end-0 top-50 translate-middle-y me-2" onClick={clearAgent}>✕</button>}
                                </div>
                                {showAgentDropdown && filteredAgents.length > 0 && (
                                    <div className="position-absolute bg-white border rounded shadow mt-1" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto', width: '100%' }}>
                                        <table className="table table-sm table-hover mb-0">
                                            <thead className="table-light"><tr><th>Name</th><th>Address</th></tr></thead>
                                            <tbody>
                                                {filteredAgents.map(a => (
                                                    <tr key={a.id} onClick={() => { setSelectedAgent(a); setAgentSearch(a.name); setShowAgentDropdown(false); }}>
                                                        <td><strong>{a.name}</strong></td>
                                                        <td>{a.address || "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Invoice No */}
                        <div className="row g-3 mt-2">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Invoice No. (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter invoice number"
                                    value={invoiceNo}
                                    onChange={(e) => setInvoiceNo(e.target.value)}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* === RESULTS ONLY AFTER SEARCH === */}
            {hasSearched && (
                <>
                    {/* Summary Print */}
                    {saleSummary.length > 0 && (
                        <div className="mb-4">
                            <PrintSaleSummary data={saleSummary} sDate={startDate.toLocaleDateString('en-US')} eDate={endDate.toLocaleDateString('en-US')} />
                        </div>
                    )}

                    {/* No Data */}
                    {saleData.length === 0 && (
                        <div className="text-center my-5">
                            <div className="alert alert-info d-inline-block">
                                <h5>No sale records found</h5>
                                <p className="mb-0">Try adjusting dates, customer, agent, or invoice number.</p>
                            </div>
                        </div>
                    )}

                    {/* Sale Data Table */}
                    {saleData.length > 0 && (
                        <>
                            {/* Summary */}
                            <div className="card mb-4 shadow">
                                <div className="card-header bg-success text-white">
                                    <h4 className="mb-0">Sale Summary</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row text-center">
                                        <div className="col-md-3"><h5>Records</h5><h3 className="text-primary">{summary.records}</h3></div>
                                        <div className="col-md-3"><h5>Total Items</h5><h3 className="text-success">{summary.totalItems}</h3></div>
                                        <div className="col-md-3"><h5>Invoice Value</h5><h3 className="text-danger">{summary.totalValue.toFixed(3)}</h3></div>
                                        <div className="col-md-3"><h5>Total Profit</h5><h3 className="text-info">{summary.totalProfit.toFixed(3)}</h3></div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mb-4 text-end">
                                <DownloadTableExcel filename={`sale_report_${startDate.toISOString().slice(0, 10)}_${endDate.toISOString().slice(0, 10)}`} sheet="Sales" currentTableRef={tableRef.current}>
                                    <button className="btn btn-success me-2">Export Excel</button>
                                </DownloadTableExcel>
                                <button className="btn btn-secondary" onClick={handlePrint}>Print</button>
                                {/* Sale Invoice Print Button */}
                                {selectedInvoice && saleInvoiceDetailData.length > 0 && (
                                    // <PdfInvoice invoice={saleInvoiceDetailData} />
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => PdfInvoice({ invoice: saleInvoiceDetailData })} // Trigger PDF print
                                        title="Print Invoice"
                                    >
                                        <i className="fas fa-print"></i> {/* Printer icon */}
                                    </button>
                                )}
                            </div>

                            {/* Main Table */}
                            <div className="card shadow mb-4">
                                <div className="card-header bg-primary text-white d-flex justify-content-between">
                                    <h4 className="mb-0">Sales Invoices</h4>
                                    <div>
                                        <label className="text-white me-2">Rows per page:</label>
                                        <select className="form-select d-inline-block w-auto" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                                            {pageSizeOptions.map(n => <option key={n}>{n}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover" ref={tableRef}>
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Reff Invoice</th>
                                                    <th>Customer</th>
                                                    <th>Agent</th>
                                                    <th>Total Items</th>
                                                    <th>Invoice Value</th>
                                                    <th>Profit</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedData.map((item) => (
                                                    <tr key={item.saleInvoiceId} className="cursor-pointer" onClick={() => selectInvoice(item)}>
                                                        <td>{item.saleInvoiceId}</td>
                                                        <td>{item.name || "N/A"}</td>
                                                        <td>{item.agentname || "N/A"}</td>
                                                        <td>{item.totalitems}</td>
                                                        <td>{parseFloat(item.invoicevalue || 0).toFixed(3)}</td>
                                                        <td>{parseFloat(item.profit || 0).toFixed(3)}</td>
                                                        <td>{new Date(item.date).toLocaleString()}</td>
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

                            {/* Invoice Details */}
                            {selectedInvoice && saleInvoiceDetailData.length > 0 && (
                                <div className="card shadow">
                                    <div className="card-header bg-info text-white">
                                        <h4 className="mb-0">Invoice Details - ID: {selectedInvoice.saleInvoiceId} ({selectedInvoice.name})</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-striped" ref={detailTableRef}>
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Date</th>
                                                        <th>Sale ID</th>
                                                        <th>Item</th>
                                                        <th>Price</th>
                                                        <th>Qty</th>
                                                        <th>Cost</th>
                                                        <th>Profit</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {saleInvoiceDetailData.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.id}</td>
                                                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                                                            <td>{item.saleInvoiceId}</td>
                                                            <td>{item.itemname || "N/A"}</td>
                                                            <td>{parseFloat(item.price || 0).toFixed(3)}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{parseFloat(item.cost || 0).toFixed(3)}</td>
                                                            <td>{parseFloat((item.price * item.quantity) - (item.cost * item.quantity)).toFixed(3)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <PdfInvoice invoice={saleInvoiceDetailData} />
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
                    <h4>Please use the search form above to generate a sale report</h4>
                    <p>Select dates, optionally customer/agent, or enter invoice number, then click Search.</p>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    currentUser: state.user.user,
    saleData: state.sale.sale || [],
    saleSummary: state.sale.saleSummary || [],
    saleInvoiceDetailData: state.sale.saleInvoiceDetail || [],
    userData: state.user.users || { user: [] }
});

const mapDispatchToProps = {
    fetchSaleByDate,
    fetchSaleInvoiceDetailAsync,
    fetchSaleByDateSummary,
    fetchUserStartAsync,
};

export default connect(mapStateToProps, mapDispatchToProps)(SaleReport);